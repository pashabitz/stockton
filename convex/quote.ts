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

export const getQuoteAction = action({
    args: { ticker: v.string() },
    handler: async (ctx, args) => {
        const queryString = `quote?symbol=${args.ticker}`;
        const data = await fetch(finnhubUrl(queryString));
        const json = await data.json();
        await ctx.runMutation(internal.search.updateSearchPrice, {
            text: args.ticker,
            price: json.c,
        });
        return json;
    }
});
