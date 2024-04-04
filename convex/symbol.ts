import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
    args: {
        symbol: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("symbol")
            .filter((q) => q.eq(q.field("symbol"), args.symbol))
            .unique();
    },
});