import { ChainFlipProvider } from "./chainflip";
import { MayaProvider } from "./maya";
import { ThorchainProvider } from "./thorswap";
import { ZeroXProvider } from "./zerox";

const providers = [
    ChainFlipProvider,
    ThorchainProvider,
    MayaProvider,
    ZeroXProvider
]

export function getProvidersForSwap(swap){
    return providers.filter(provider => {
        const canQuote = provider.canQuote(swap);
        const kind = swap.segment

        console.log({provider, canQuote, kind, swap})

        return canQuote
    })
}