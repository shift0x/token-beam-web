import { MayaList } from "@swapkit/tokens";
import { canProviderSwapTokens } from "./utils";

const apiBaseUrl = "https://api.swapkit.dev/quote"

const providerId = "maya";

function canQuote(swap){
    return canProviderSwapTokens(swap.from.id, swap.to.id, MayaList.tokens)
}

async function quote(swap, amountIn){
    const params = {
        sellAsset: swap.from.id,
        buyAsset: swap.to.id,
        sellAmount: amountIn,
        providers: [ "MAYACHAIN" ]
    }

    try {
        const response = await fetch(apiBaseUrl, {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const body = await response.json();

        if(!body.routes || body.routes.length == 0) { return { amountOut: 0, data: body }}

        const optimalRoute = body.routes[0]

        return {
            amountOut: Number(optimalRoute.expectedBuyAmount),
            route: optimalRoute,
            data: body,
            provider: MayaProvider
        }
    } catch(err){
        return { amountOut: 0, error: err}
    }
}

async function createOperation(swap, prev, next, to){
    // maya needs a deposit address
    return null;
}

export const MayaProvider = {
    canQuote,
    quote,
    providerId,
    createOperation
}