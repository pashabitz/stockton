import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "refreshPrice",
    { hours: 12 },
    internal.quote.refreshPrice,
)

export default crons;