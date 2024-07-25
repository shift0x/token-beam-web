import { getRoutes } from "./routeprovider";
import { getQuote } from "./routequoter";

export function getQuotes(from, to){
    const routes = getRoutes(from, to)

    return routes.map(route => {
        return getQuote(from, to, route)
    });
}