import { canProviderSwapTokens, numberFromBig, numberToBig } from "./utils";
import { ChainflipList } from "@swapkit/tokens";

const quoteApiBaseUrl = "https://token-beam-api.vercel.app/api"

const providerId = "chainflip"

function canQuote(swap){
    return canProviderSwapTokens(swap.from.id, swap.to.id, ChainflipList.tokens)
}

async function quote(swap, amountIn){
    const result = { amountOut: -1, provider: ChainFlipProvider }
    const params = {
        from: swap.from.id.split("-")[0],
        to: swap.to.id.split("-")[0],
        provider: "chainflip",
        network: "mainnet",
        amount: await numberToBig(swap.from, amountIn)
    }

    if(params.amount == null){ return result; }

    try {
        const searchParams = new URLSearchParams(params);
        const response = await fetch(`${quoteApiBaseUrl}/price?${searchParams}`);
        const body = await response.json();

        if(body.error != null){ throw body.error; }
    
        result.amountOut = await numberFromBig(swap.to, body.data.amountOut)
        result.route = body.data
        result.data = body
    } catch(err){
        result.error = err
    } finally {
        return result
    }
}

export const ChainFlipProvider = {
    canQuote,
    quote,
    providerId,
}