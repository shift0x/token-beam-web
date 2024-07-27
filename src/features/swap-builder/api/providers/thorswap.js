import { canProviderSwapTokens } from "./utils";
import { OneInchList, 
    PancakeswapList, 
    PangolinList, 
    SushiswapList, 
    ThorchainList, 
    TraderjoeV1List, 
    TraderjoeV2List, 
    UniswapV2List, 
    UniswapV3List } from "@swapkit/tokens";

const supportedTokens = [
    ...OneInchList.tokens,
    ...PancakeswapList.tokens,
    ...PangolinList.tokens,
    ...SushiswapList.tokens,
    ...ThorchainList.tokens,
    ...TraderjoeV1List.tokens,
    ...TraderjoeV2List.tokens,
    ...UniswapV2List.tokens,
    ...UniswapV3List.tokens
]

const apiBaseUrl = "https://api.thorswap.finance";


const providerId = "thorchain";

function canQuote(swap){
    return canProviderSwapTokens(swap.from.id, swap.to.id, supportedTokens);
}

async function fetchWithConfig(url) {
    const response = await fetch(url);
    const body = await response.json();

    return body;
  }

async function quote(swap, amountIn){
    const searchParams = new URLSearchParams({
        sellAsset: swap.from.id,
        buyAsset: swap.to.id,
        sellAmount: amountIn
    });

    try {
        const response = await fetchWithConfig(`${apiBaseUrl}/aggregator/tokens/quote?${searchParams}`);
        const routes = response.routes;

        if(!routes) { return { amountOut: 0 }}

        const optimalRoute = routes[0];

        return { amountOut: Number(optimalRoute.expectedOutput), route: optimalRoute, data: response, provider:  ThorchainProvider }
    } catch(err){
        console.log(err);
        
        return { amountOut: 0, error: err}
    }
}

export const ThorchainProvider = {
    canQuote,
    quote,
    providerId,
}