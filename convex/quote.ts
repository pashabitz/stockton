import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

function finnhubUrl(queryString: string) {
    return (
      "https://finnhub.io/api/v1/" +
      queryString +
      "&token=" +
      process.env.FINNHUB_KEY
    );
  }
  
export const getQuote = httpAction(async (ctx, request: Request) =>{
    // get ticket from the query string
    const param = request.url.split("?")[1];
    const ticker = param.split("=")[1];
    
    const queryString = `quote?symbol=${ticker}`;
    const data = await fetch(finnhubUrl(queryString));
    const json = await data.json();
    await ctx.runMutation(internal.search.updateSearchPrice, { text: ticker, price: json.c });
    
    return new Response(JSON.stringify(json), {
        status: 200,
        headers: new Headers({
            "Access-Control-Allow-Origin": "*",
          }),
    });
});