import { ROUTE_SEGMENT } from "../routesegment";
import { canProviderQuoteSwap } from "./utils";

const segmentsRequiringSwapToLongTailToken = [
    ROUTE_SEGMENT.crosschainNativeToToken,
    ROUTE_SEGMENT.crosschainTokenToToken,
    ROUTE_SEGMENT.nativeToToken,
]

const segmentsRequiringSwapFromLongTailToken = [
    ROUTE_SEGMENT.crosschainTokenToNative,
    ROUTE_SEGMENT.crosschainTokenToToken,
    ROUTE_SEGMENT.tokenToNative
]

const supportedSegments = [
    ROUTE_SEGMENT.crosschainNativeToNative,
    ...segmentsRequiringSwapToLongTailToken,
    ...segmentsRequiringSwapFromLongTailToken
]

const providerId = "swapkit";

function canQuote(swap){
    const isSupported = canProviderQuoteSwap(swap, providerId, supportedSegments)

    if(!isSupported){ return false; }

    const requiresSwapFromLongTailToken = segmentsRequiringSwapFromLongTailToken.indexOf(swap.segment) != -1;
    const requiredSwapToLongTailToken = segmentsRequiringSwapToLongTailToken.indexOf(swap.segment) != -1;

    const fromTokenId = swap.from.meta.swapkit ? swap.from.meta.swapkit.id : null;
    const toTokenId = swap.to.meta.swapkit ? swap.to.meta.swapkit.id : null;

    if(requiresSwapFromLongTailToken && !fromTokenId) { return false; }
    if(requiredSwapToLongTailToken && !toTokenId) { return false; }
    
    return true;
}

function quote(swap){
    return 0;
}

export const SwapkitProvider = {
    canQuote,
    quote,
    providerId,
    supportedSegments,
}