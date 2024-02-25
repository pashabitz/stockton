import { httpRouter } from "convex/server";
import { getQuote } from "./quote";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/quote",
  method: "GET",
  handler: getQuote,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;