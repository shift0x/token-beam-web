import arb from '../../stores/tokens/arbitrum-one.json'
import avax from '../../stores/tokens/avalanche.json'
import bsc from '../../stores/tokens/binance-smart-chain.json'
import eth from '../../stores/tokens/ethereum.json'
import defaults from './network-defaults.json'

import { 
    OneInchList,
    MayaList,
    PancakeswapList,
    PangolinList,
    SushiswapList,
    ThorchainList,
    ChainflipList,
} from "@swapkit/tokens";

const networks = {};
const swapkitTokenLookup = { gasTokens: {} };

[
    ...OneInchList.tokens,
    ...MayaList.tokens,
    ...PancakeswapList.tokens,
    ...PangolinList.tokens,
    ...SushiswapList.tokens,
    ...ThorchainList.tokens,
    ...ChainflipList.tokens
].forEach(token => {
    const id = makeTokenId(token.chainId, token.ticker);

    swapkitTokenLookup[id] = token;

    const isGasToken = token.identifier.indexOf(".") != -1 && !token.address;

    if(isGasToken) {
        swapkitTokenLookup.gasTokens[token.chainId] = token
    }

});

function makeTokenId(chainId, symbol) {
    if(!chainId || !symbol) { return ""; }

    return `${chainId.trim().toLowerCase()}::${symbol.trim().toLowerCase()}`
}


function makeNetwork(base){
    const network = { ...base, ...defaults[base.id]}

    network.tokens = network.tokens ?? [];

    // hydrate metadata for matching tokens between coingecko lists and swapkit api
    network.tokens.forEach(token => {
        const id = makeTokenId(network.chainId, token.symbol);
        const swapkitToken = swapkitTokenLookup[id];
        const meta = {};

        if(swapkitToken) {
            meta.swapkit = { id: swapkitToken.identifier };
            meta.decimals = swapkitToken.decimals;
        }

        token.meta = meta;
        token.chainId = network.chainId
    })

    // resolve the network base token (gas token)
    const nativeToken = getNetworkNativeToken(network.chainId);

    network.tokens = [ nativeToken, ...network.tokens];
    network.native = nativeToken;

    networks[network.chainId] = network;

    return network;
}

export function networkSupportsProvider(chainId, provider){
    const network = networks[chainId];

    return network != null && network.providers.indexOf(provider) != -1;
}

export function getNetworks(){
    return [
        makeNetwork({id: "bitcoin"}),
        makeNetwork(eth),
        makeNetwork(arb),
        makeNetwork(avax),
        makeNetwork(bsc),
        makeNetwork({id: "cosmos"}),
        makeNetwork({id: "bitcoin-cash"}),
        makeNetwork({id: "dash"}),
        makeNetwork({id: "dogecoin"}),
        makeNetwork({id: "litecoin"}),
        makeNetwork({id: "polkadot"}),
        
    ]
}

export function getNetworkNativeToken(chainId) {
    const swapkitNetworkToken = swapkitTokenLookup.gasTokens[chainId]

    const nativeToken = {
        id: swapkitNetworkToken.identifier,
        chainId: chainId,
        image: swapkitNetworkToken.logoURI,
        name: `${swapkitNetworkToken.ticker} (Native)`,
        symbol: swapkitNetworkToken.identifier.split(".")[1],
        meta: {
            swapkit: { id: swapkitNetworkToken.identifier },
            decimals: swapkitNetworkToken.decimals
        },
        isNative: true,
    }

    return  nativeToken
}