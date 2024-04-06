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

export const getQuote = action({
    args: { ticker: v.string() },
    handler: async (ctx, args) => {
        const json = await getQuoteFromFinnhub(args.ticker);
        await ctx.runMutation(internal.search.updateSearchPrice, {
            text: args.ticker,
            price: json.c,
        });
        await ctx.scheduler.runAfter(0, internal.quote.refreshBasicStatsIfStale, {
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

export const refreshBasicStatsIfStale = internalAction({
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
        const records = await ctx.runQuery(api.search.getLeastRecentlyUpdated);
        await Promise.all(records.map(async (record) => {
            const json = await getQuoteFromFinnhub(record.text);
            await ctx.runMutation(internal.search.updateSearchPrice, {
                text: record.text,
                price: json.c
            });
        }));
    }
})