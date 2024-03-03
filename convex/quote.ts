import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";

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
        return json;
    }
});



export const getBasicStats = action({
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