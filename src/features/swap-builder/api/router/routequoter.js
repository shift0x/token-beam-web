

export async function getQuote(from, to, route){
    var amountOut = from.amount;

    for(var i =0; i < route.length;i++){
        const swap = route[i];

        swap.quote = {
            amountIn: amountOut,
            amountOut: 0
        }

        const swapQuotes = await Promise.all(swap.providers.map(async provider => { 
            return provider.quote(swap, swap.quote.amountIn ); 
        }));

        const sortedSwapQuotes = swapQuotes.sort((x,y) => { 
            return x.amountOut < y.amountOut ? 1 : -1;
        });

        const optimalQuote = sortedSwapQuotes[0];

        swap.quote.amountOut = optimalQuote.amountOut;
        swap.quote.execution = optimalQuote

        amountOut = swap.quote.amountOut;

        if(amountOut <= 0) {
            break;
        }
    }

    const quote = { route }
    const isCompletedQuote = route.filter(x => { return x.quote == null}).length == 0;

    quote.amountIn = from.amount;
    quote.amountOut = isCompletedQuote ? route[route.length-1].quote.amountOut : 0;

    console.log(quote);

    return route
}