import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { refreshFullQuotes } from "./quote";

const crons = cronJobs();

crons.interval(
    "Refresh Stats",
    { hours: 8 },
    internal.symbol.refreshStaleSymbols,
);

crons.cron(
    "Refresh Price Changes",
    "1 20 * * 1-5",
    internal.quote.refreshPriceChanges,
);
crons.cron(
    "Refresh Full Quotes",
    "*/10 14-19 * * 1-5",
    internal.quote.refreshFullQuotes,
);
crons.cron(
    "Refresh Full Quotes market open",
    "30,40,50 13 * * 1-5",
    internal.quote.refreshFullQuotes,
);
crons.cron(
    "Refresh Full Quotes market close",
    "0 20 * * 1-5",
    internal.quote.refreshFullQuotes,
);

export default crons;