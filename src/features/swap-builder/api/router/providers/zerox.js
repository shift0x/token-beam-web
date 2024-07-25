import { ROUTE_SEGMENT } from "../routesegment";
import { canProviderQuoteSwap } from "./utils";

const supportedSegments = [
    ROUTE_SEGMENT.tokenToNative
]

const providerId = "0x";

function canQuote(swap){
    return canProviderQuoteSwap(swap, providerId, supportedSegments)
}

function quote(swap){
    return 0;
}

export const ZeroXProvider = {
    canQuote,
    quote,
    providerId,
    supportedSegments,
}