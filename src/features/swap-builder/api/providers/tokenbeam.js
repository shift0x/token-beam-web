import { ROUTE_SEGMENT } from "../routesegment";
import { ChainFlipProvider } from "./chainflip";
import { canProviderQuoteSwap } from "./utils";

const supportedChains = [ "42161" ]
const providerId = "tokenbeam"

const supportedCrosschainSegments = [
    ROUTE_SEGMENT.crosschainNativeToToken,
    ROUTE_SEGMENT.crosschainTokenToNative,
]

const supportedIntrachainSegments = [
    ROUTE_SEGMENT.nativeToToken,
    ROUTE_SEGMENT.tokenToNative,
]

const supportedSegments = [
    ...supportedCrosschainSegments,
    ...supportedIntrachainSegments,
]

function canQuote(swap){
    if(supportedCrosschainSegments.indexOf(swap.segment) !==-1) {
        const isSupportedSwapToToken = swap.segment ===ROUTE_SEGMENT.crosschainNativeToToken && supportedChains.indexOf(swap.to.chainId) !==-1;
        const isSupportedSwapFromToken = swap.segment ===ROUTE_SEGMENT.crosschainTokenToNative && supportedChains.indexOf(swap.from.chainId) !==-1;
        
        if(!isSupportedSwapToToken && !isSupportedSwapFromToken){ return false; }

        return canProviderQuoteSwap(swap, ChainFlipProvider.providerId, supportedSegments)
    }

    return canProviderQuoteSwap(swap, providerId, supportedSegments)
}

function quote(swap){
    return 0;
}

export const TokenBeamProvider = {
    canQuote,
    quote,
    supportedSegments,
    providerId
}