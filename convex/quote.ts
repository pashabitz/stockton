import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

function finnhubUrl(queryString: string) {
    return (
      "https://finnhub.io/api/v1/" +
      queryString +
      "&token=" +
      process.env.FINNHUB_KEY
    );
  }
async function getQuoteFromFinnhub(ticker: string) {
    const queryString = `quote?symbol=${ticker}`;
    const response = await fetch(finnhubUrl(queryString));
    return await response.json();
}

function fmpUrl(queryString: string) {
    return (
      "https://financialmodelingprep.com/api/v3/" +
      queryString +
      "?apikey=" + process.env.FMP_KEY
    );
}

async function getQuoteFromFmp(ticker: string) {
    const url = fmpUrl(`quote-short/${ticker}`);
    console.log(url);
    const response = await fetch(url);
    return await response.json();
};

async function getMultiQuoteFromFmp(tickers: string[]) {
    const url = fmpUrl(`quote-short/${tickers.join(",")}`);
    const response = await fetch(url);
    return await response.json();
}

async function getFullQuoteFromFmp(tickers: string[]) {
    const url = fmpUrl(`quote/${tickers.join(",")}`);
    const response = await fetch(url);
    return await response.json();
}

async function getPriceChanges(tickers: string[]) {
    const url = fmpUrl(`stock-price-change/${tickers.join(",")}`);
    const response = await fetch(url);
    return await response.json();
}

export const getQuote = action({
    args: { ticker: v.string() },
    handler: async (ctx, args) => {
        const json = await getQuoteFromFinnhub(args.ticker);
        await ctx.runMutation(internal.search.updateSearchPrice, {
            text: args.ticker,
            price: json.c,
        });
        await ctx.scheduler.runAfter(0, api.quote.refreshBasicStatsIfStale, {
            ticker: args.ticker
        });

        await ctx.scheduler.runAfter(1, internal.quote.refreshFullQuoteIfStale, { 
            ticker: args.ticker 
        });

        return json;
    }
});

export const getBasicStatsFromApi = action({
    args: { ticker: v.string() },
    handler: async (ctx, args) => {
        const queryString = `/stock/metric?symbol=${args.ticker}&metric=all`;
        const response = await fetch(finnhubUrl(queryString));
        const json = await response.json();
        await ctx.runMutation(internal.search.updateBasicStats, {
            text: args.ticker,
            stats: json,
        });
        return json;
    }
});

export const refreshBasicStatsIfStale = action({
    args: {ticker: v.string() },
    handler: async (ctx, args) => {
        const dayAgo = Date.now() - (1000 * 60 * 60 * 24);
        const symbol = await ctx.runQuery(api.symbol.get, { symbol: args.ticker });
        if (!symbol || !symbol.updatedAt || symbol.updatedAt < dayAgo) {
            await ctx.runAction(api.quote.getBasicStatsFromApi, { ticker: args.ticker })
        } else {
        }
    }
});

export const refreshPrice = internalAction({
    args: {},
    handler: async (ctx) => {
        const records = await ctx.runQuery(api.search.get);
        const tickers = records.map((record) => record.text);
        console.log(`Refreshing prices for ${tickers}`);
        const quotes = await getMultiQuoteFromFmp(tickers);
        for (let i = 0; i < quotes.length; i++) {
            let quote = quotes[i];
            await ctx.runMutation(internal.search.updateSearchPrice, {
                text: quote.symbol,
                price: quote.price
            });
        };
    }
});

export const refreshFullQuotes = internalAction({
    args: {},
    handler: async (ctx) => {
        const records = await ctx.runQuery(api.search.get);
        const tickers = records.map((record) => record.text);
        console.log(`Refreshing full quotes for ${tickers}`);
        const quotes = await getFullQuoteFromFmp(tickers);
        for (let i = 0; i < quotes.length; i++) {
            let quote = quotes[i];
            await ctx.runMutation(internal.search.insertFullQuote, quote);
        };
    }
});

export const refreshFullQuoteIfStale = internalAction({
    args: { ticker: v.string() },
    handler: async (ctx, args) => {
        const fullQuote = await ctx.runQuery(api.search.getFullQuote, { symbol: args.ticker });
        if (!fullQuote) {
            const quotes = await getFullQuoteFromFmp([args.ticker]);
            if (quotes.length > 0) {
                await ctx.runMutation(internal.search.insertFullQuote, quotes[0]);
            }

            // TODO also refresh price changes; 
            // but first - modify the signature of insert price chnage
        }
    }
});

export const refreshPriceChanges = internalAction({
    args: {},
    handler: async (ctx) => {
        const tickers = await ctx.runQuery(api.search.get);
        const priceChanges = await getPriceChanges(tickers.map((ticker) => ticker.text));
        console.log(`Refreshing price change for ${priceChanges}`);
        for (let i = 0; i < priceChanges.length; i++) {
            let priceChange = priceChanges[i];
            await ctx.runMutation(internal.search.insertPriceChange, {
                symbol: priceChange.symbol,
                d1: priceChange["1D"],
                d5: priceChange["5D"],
                m1: priceChange["1M"],
                m3: priceChange["3M"],
                m6: priceChange["6M"],
                ytd: priceChange["ytd"],
                y1: priceChange["1Y"],
                y3: priceChange["3Y"],
                y5: priceChange["5Y"],
                y10: priceChange["10Y"],
                max: priceChange["max"],
            });
        }
    }
});