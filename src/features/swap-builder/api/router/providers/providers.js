import { ChainFlipProvider } from "./chainflip";
import { SwapkitProvider } from "./swapkit";
import { TokenBeamProvider } from "./tokenbeam";
import { ZeroXProvider } from "./zerox";

const providers = [
    ChainFlipProvider,
    SwapkitProvider,
    TokenBeamProvider,
    ZeroXProvider
]

export function getProvidersForSwap(swap){
    return providers.filter(provider => {
        const canQuote = provider.canQuote(swap);

        return canQuote
    })
}