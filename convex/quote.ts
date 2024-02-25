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
    const urlTofetch = finnhubUrl(queryString);
    console.log(urlTofetch);
    const data = await fetch(urlTofetch);
    const json = await data.json();
    return new Response(JSON.stringify(json), {
        status: 200,
        // headers: new Headers({
        //     "Access-Control-Allow-Origin": "*",
        //   }),
    });
});