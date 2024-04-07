import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "Refresh Stats",
    { hours: 8 },
    internal.symbol.refreshStaleSymbols,
)

crons.interval(
    "Refresh Prices",
    { hours: 2 },
    internal.quote.refreshPrice,
)

export default crons;