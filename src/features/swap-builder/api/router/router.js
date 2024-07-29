import { getRoutes } from "./routeprovider";
import { getQuote } from "./routequoter";

export async function getQuotes(from, to){
    const routes = getRoutes(from, to)
    const quotes = await Promise.all(routes.map((route, index) => {
        return getQuote(index, from, to, route)
    }));


    return quotes
        .filter(quote => { return quote.amountOut > 0})
        .sort((x,y)  => {
            return x.amountOut < y.amountOut ? 1 : -1;
        })
}