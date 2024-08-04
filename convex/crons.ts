import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "Refresh Stats",
    { hours: 8 },
    internal.symbol.refreshStaleSymbols,
);

// comment
crons.cron(
    "Refresh Prices",
    "5,35 15-19 * * 1-5",
    internal.quote.refreshPrice,
);

crons.cron(
    "Refresh Price Changes",
    "0 18 * * 1-5",
    internal.quote.refreshPriceChanges,
);

export default crons;