import { getRoutes } from "./routeprovider";
import { getQuote } from "./routequoter";

export async function getQuotes(from, to){
    const routes = getRoutes(from, to)

    await Promise.all(routes.map(route => {
        return getQuote(from, to, route)
    }));
}