import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  search: defineTable({
    price: v.optional(v.float64()),
    search_count: v.float64(),
    stats: v.optional(v.any()),
    text: v.string(),
    updatedAt: v.optional(v.union(v.float64(), v.string())),
  }).index("by_updatedAt", ["updatedAt"]),

  symbol: defineTable({
    symbol: v.string(),
    stats: v.optional(v.any()),
    updatedAt: v.optional(v.float64()),
  }).index("by_symbol", ["symbol"])
  .index("by_updatedAt", ["updatedAt"]),

  price: defineTable({
    symbol: v.string(),
    price: v.float64(),
  }).index("by_symbol", ["symbol"]),

  priceChange: defineTable({
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
  }).index("by_symbol", ["symbol"]),
  fullQuote: defineTable({
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
  }).index("by_symbol", ["symbol"]),
});