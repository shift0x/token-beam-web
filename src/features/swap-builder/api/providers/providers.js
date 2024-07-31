import { ChainFlipProvider } from "./chainflip";
import { MayaProvider } from "./maya";
import { ThorchainProvider } from "./thorchain";
import { ZeroXProvider } from "./zerox";

const providers = [
    ChainFlipProvider,
    ThorchainProvider,
    MayaProvider,
    ZeroXProvider
]

export function getProvidersForSwap(swap, network){
    return providers.filter(provider => {
        const canQuote = provider.canQuote(swap, network);

        return canQuote
    })
}