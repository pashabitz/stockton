import { internalMutation } from "@/convex/_generated/server";

export const moveDataFromSearchToSymbol = internalMutation(async ({db}) => {
    const searches = await db.query("search").collect();
    for (const search of searches) {
        await db.insert("symbol", {
            symbol: search.text,
            stats: search.stats,
        });
        await db.patch(search._id, { stats: undefined });
    }
  });
  