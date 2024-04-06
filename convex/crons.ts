import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "refreshStats",
    { hours: 8 },
    internal.symbol.refreshStaleSymbols,
)

export default crons;