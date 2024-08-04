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
  }).index("by_symbol", ["symbol"])
});