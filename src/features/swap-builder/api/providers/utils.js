import {utils} from 'ethers';

import { OneInchList, 
    PancakeswapList, 
    PangolinList, 
    SushiswapList, 
    ThorchainList, 
    TraderjoeV1List, 
    TraderjoeV2List, 
    UniswapV2List, 
    UniswapV3List,
    ChainflipList,
    MayaList } from "@swapkit/tokens";

const allTokens = [
    ...OneInchList.tokens,
    ...PancakeswapList.tokens,
    ...PangolinList.tokens,
    ...SushiswapList.tokens,
    ...ThorchainList.tokens,
    ...TraderjoeV1List.tokens,
    ...TraderjoeV2List.tokens,
    ...UniswapV2List.tokens,
    ...UniswapV3List.tokens,
    ...ChainflipList.tokens,
    ...MayaList.tokens
]

export function canProviderSwapTokens(from, to, supportedTokens){
    const supportedFromToken = supportedTokens.find(token => { return token.identifier.toUpperCase() == from.toUpperCase()});
    const supportedToToken = supportedTokens.find(token => { return token.identifier.toUpperCase() == to.toUpperCase()});

    return supportedFromToken != null && supportedToToken != null;
}

export function numberToBig(tokenId, amount) {
    const token = allTokens.find(token => { return token.identifier.toUpperCase() == tokenId.toUpperCase() })

    if(!token) { return null }

    return utils.parseUnits(amount.toString(), token.decimals).toString();
}

export function numberFromBig(tokenId, amount){
    const token = allTokens.find(token => { return token.identifier.toUpperCase() == tokenId.toUpperCase() })

    if(!token) { return null }

    return Number(utils.formatUnits(amount.toString(), token.decimals));
}