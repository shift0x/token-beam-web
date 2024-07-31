import logo from '../../../../assets/images/thorchain_logo_sm.png'
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

async function quote(swap, amountIn, network){
    if(network !=="mainnet")
        return { amountOut: 0, error: `network (${network}) not supported` }

    const searchParams = new URLSearchParams({
        sellAsset: swap.from.id,
        buyAsset: swap.to.id,
        sellAmount: amountIn
    });

    const result = { amountOut: -1, provider: ThorchainProvider }

    try {
        const response = await fetchWithConfig(`${apiBaseUrl}/aggregator/tokens/quote?${searchParams}`);
        const routes = response.routes;

        if(!routes) { return result }

        const optimalRoute = routes[0];

        result.amountOut = Number(optimalRoute.expectedOutput);
        result.route = optimalRoute;
        result.data = response;
    } catch(err){
        result.error = err
    } finally {
        return result;
    }
}

async function createOperation(swap, prev, next, to){
    // throchain needs a deposit address

    return null;
}

export const ThorchainProvider = {
    canQuote,
    quote,
    providerId,
    createOperation,
    logo
}