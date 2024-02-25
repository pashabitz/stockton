import { httpRouter } from "convex/server";
import { getQuote } from "./quote";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
    path: "/quote",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
        return new Response(null, {
            headers: new Headers({
            // e.g. https://mywebsite.com, configured on your Convex dashboard
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Digest",
            "Access-Control-Max-Age": "86400",
            }),
        });
    }),
  });
http.route({
  path: "/quote",
  method: "GET",
  handler: getQuote,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;