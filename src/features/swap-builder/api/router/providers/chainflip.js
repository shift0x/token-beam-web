import { ROUTE_SEGMENT } from "../routesegment";
import { canProviderQuoteSwap } from "./utils";

const supportedSegments = [ ROUTE_SEGMENT.crosschainNativeToNative ]
const providerId = "chainflip"


function canQuote(swap){
    return canProviderQuoteSwap(swap, providerId, supportedSegments)
}

function quote(swap){
    return 0;
}

export const ChainFlipProvider = {
    canQuote,
    quote,
    providerId,
    supportedSegments,
}