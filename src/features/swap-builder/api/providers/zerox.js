import { getTokenAddress, getTokenChain } from "../network/networks";
import { ROUTE_SEGMENT } from "../router/routesegment";
import { numberFromBig, numberToBig } from "./utils";

const providerId = "0x";
const endpoints = {
    "1": "https://api.0x.org",
    "42161": "https://arbitrum.api.0x.org",
    "43114": "https://avalanche.api.0x.org",
    "56": "https://bsc.api.0x.org",
    "ethereum-sepolia": "https://sepolia.api.0x.org"
}

function canQuote(swap){
    const canQuoteSegment = swap.segment == ROUTE_SEGMENT.tokenToNative

    if(!canQuoteSegment) { return false; }

    const fromChain = getTokenChain(swap.from)
    const toChain = getTokenChain(swap.to)

    if(fromChain != toChain) { return false; }

    const endpoint = endpoints[swap.from.chainId];

    return endpoint != null;
}

async function quote(swap, amountIn){
    const args = new URLSearchParams({
        sellToken: getTokenAddress(swap.from),
        buyToken: getTokenAddress(swap.to),
        sellAmount: await numberToBig(swap.from, amountIn)
    })

    const url = `${endpoints[swap.from.chainId]}/swap/v1/price?${args}`
    const result = { amountOut: -1, provider: ZeroXProvider }

    try {
        const response = await fetch(url, {
            headers : {
                "0x-api-key": "32bf0773-ae1e-4389-ba61-34115a695dd3"
            }
        });
        const body = await response.json();

        if(body.error != null){ throw body.error; }
    
        result.amountOut = await numberFromBig(swap.to, body.buyAmount)
        result.route = body
        result.data = body
    } catch(err){
        result.error = err
    } finally {
        return result
    }
}

export const ZeroXProvider = {
    canQuote,
    quote,
    providerId,
}