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
import {  getTokenDecimalsFromChain } from '../../utils/token';

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

async function getTokenDecimals(tokenToLookup){
    const token = allTokens.find(t => { return t.identifier.toUpperCase() ===tokenToLookup.id.toUpperCase() })

    if(!token){ return getTokenDecimalsFromChain(tokenToLookup); }

    return token.decimals;
}

export function canProviderSwapTokens(from, to, supportedTokens){
    const supportedFromToken = supportedTokens.find(token => { return token.identifier.toUpperCase() ===from.toUpperCase()});
    const supportedToToken = supportedTokens.find(token => { return token.identifier.toUpperCase() ===to.toUpperCase()});

    return supportedFromToken !==null && supportedToToken !==null;
}

export async function numberToBig(token, amount) {
    const decimals = await getTokenDecimals(token)
    
    if(!decimals) { return null }

    return utils.parseUnits(amount.toString(), decimals).toString();
}

export async function numberFromBig(token, amount){
    const decimals = await getTokenDecimals(token)
    
    if(!decimals) { return null }

    return Number(utils.formatUnits(amount.toString(), decimals));
}