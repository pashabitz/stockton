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
});