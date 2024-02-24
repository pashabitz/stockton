import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("search").collect();
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