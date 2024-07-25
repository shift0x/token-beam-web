import { networkSupportsProvider } from "../../network/networks";

export function canProviderQuoteSwap(swap, providerId, supportedSegments) {
    const isSupportedSegment = supportedSegments.indexOf(swap.segment) != -1;

    if(!isSupportedSegment) { return false; }

    const isSourceChainSupported = networkSupportsProvider(swap.from.chainId, providerId);
    const isDestinationChainSupported = networkSupportsProvider(swap.to.chainId, providerId);

    return isSourceChainSupported && isDestinationChainSupported;
}