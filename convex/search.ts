import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("search").collect();
  },
});

export const getLeastRecentlyUpdated = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("search")
      .withIndex("by_updatedAt")
      .take(10);
  },
});


// Log a search
export const updateSearch = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const lowercaseText = args.text.toLowerCase();
    // Get existing record
    const existingRecord = await ctx.db
      .query("search")
      .filter((q) => q.eq(q.field("text"), lowercaseText))
      .collect();
    if (existingRecord.length > 0) {
      // update existing record with new count
      const record = existingRecord[0];
      await ctx.db.patch(record._id, {
        search_count: record.search_count + 1,
      });
    } else {
      // Create new record
      await ctx.db.insert("search", { text: lowercaseText, search_count: 1 });
    }
  },
});

export const updateSearchPrice = internalMutation({
  args: { text: v.string(), price: v.number() },
  handler: async (ctx, args) => {
    const lowercaseText = args.text.toLowerCase();
    // Get existing record
    const existingRecord = await ctx.db
      .query("search")
      .filter((q) => q.eq(q.field("text"), lowercaseText))
      .collect();
    if (existingRecord.length > 0) {
      const record = existingRecord[0];
      await ctx.db.patch(record._id, {
        price: args.price,
        updatedAt: new Date().valueOf(),
      });
    }
    await ctx.db.insert("price", {
      symbol: lowercaseText,
      price: args.price
    });
  },
});

export const insertPriceChange = internalMutation({
  args: { 
    symbol: v.string(), 
    d1: v.number(),
    d5: v.number(),
    m1: v.number(),
    m3: v.number(),
    m6: v.number(),
    ytd: v.number(),
    y1: v.number(),
    y3: v.number(),
    y5: v.number(),
    y10: v.number(),
    max: v.number(),
  },
  handler: async (ctx, args) => {
    const lowercaseText = args.symbol.toLowerCase();
    await ctx.db.insert("priceChange", {
      ...args,
      symbol: lowercaseText,
    });
  },
});

export const insertFullQuote = internalMutation({
  args: {
    symbol: v.string(),
    name: v.string(),
    price: v.number(),
    changesPercentage: v.number(),
    change: v.number(),
    dayLow: v.number(),
    dayHigh: v.number(),
    yearLow: v.number(),
    yearHigh: v.number(),
    marketCap: v.number(),
    priceAvg50: v.number(),
    priceAvg200: v.number(),
    exchange: v.string(),
    volume: v.number(),
    avgVolume: v.number(),
    open: v.number(),
    previousClose: v.number(),
    eps: v.number(),
    pe: v.number(),
    earningsAnnouncement: v.union(v.string(), v.null()),
    sharesOutstanding: v.number(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const inserted = {...args};
    inserted.symbol = inserted.symbol.toLowerCase();
    await ctx.db.insert("fullQuote", inserted);
  },
});

export const getFullQuote = internalQuery({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    const lowercaseText = args.symbol.toLowerCase();
    const fullQuote = await ctx.db
      .query("fullQuote")
      .withIndex("by_symbol", (q) => q.eq("symbol", lowercaseText))
      .order("desc")
      .first();
    return fullQuote;
  },
});

export const updateBasicStats = internalMutation({
  args: { text: v.string(), stats: v.any() },
  handler: async (ctx, args) => {
    const lowercaseText = args.text.toLowerCase();
    // Get existing record
    const existingRecord = await ctx.db
      .query("symbol")
      .filter((q) => q.eq(q.field("symbol"), lowercaseText))
      .collect();
    if (existingRecord.length > 0) {
      const record = existingRecord[0];
      await ctx.db.patch(record._id, {
        stats: args.stats,
        updatedAt: new Date().valueOf()
      });
    } else {
      ctx.db.insert("symbol", {
        symbol: lowercaseText,
        updatedAt: new Date().valueOf(),
        stats: args.stats,
      })
    }
  },
}); 