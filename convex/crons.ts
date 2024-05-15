import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "Refresh Stats",
    { hours: 8 },
    internal.symbol.refreshStaleSymbols,
);

crons.cron(
    "Refresh Prices",
    "0,30 14-20 * * 1-5",
    internal.quote.refreshPrice,
);

export default crons;