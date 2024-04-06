import { v } from "convex/values";
import { internalAction, query } from "./_generated/server";
import { api, internal } from "./_generated/api";

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

export const getStale = query({
    args: {},
    handler: async (ctx, args) => {
        return await ctx.db.query("symbol")
            .withIndex("by_updatedAt")
            .order("asc")
            .take(2)
    },
});

export const refreshStaleSymbols = internalAction({
    args: {},
    handler: async (ctx, args) => {
        const symbols = await ctx.runQuery(api.symbol.getStale)       
        for (let i = 0 ; i < symbols.length; i++ ) {
            await ctx.runAction(internal.quote.refreshBasicStatsIfStale, { ticker: symbols[i].symbol });
        }            
    }
});  
