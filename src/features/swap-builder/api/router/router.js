import { getRoutes } from "./routeprovider";
import { getQuote } from "./routequoter";

export async function getQuotes(from, to, network){
    const routes = getRoutes(from, to)
    const quotes = await Promise.all(routes.map((route, index) => {
        return getQuote(index, from, to, route, network)
    }));


    return quotes
        .filter(quote => { return quote.amountOut > 0})
        .sort((x,y)  => {
            return x.amountOut < y.amountOut ? 1 : -1;
        })
}

export async function getExecutionOperations(route, to, network){
    const operations = await Promise.all(route.map((swap,index) => {
        const provider = swap.quote.execution.provider;
        const prev = index == 0 ? null : route[index-1];
        const next = index == route.length - 1 ? null : route[index+1];

        return provider.createOperation(swap, prev, next, to, swap.quote.amountIn, network);
    }));

    console.log(operations);

    return operations;
}