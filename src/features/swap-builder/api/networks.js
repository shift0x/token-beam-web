import arb from '../stores/tokens/arbitrum-one.json'
import avax from '../stores/tokens/avalanche.json'
import bsc from '../stores/tokens/binance-smart-chain.json'
import eth from '../stores/tokens/ethereum.json'

import defaults from './network-defaults.json';

function makeNetwork(base){
    return { ...base, ...defaults[base.id]}
}

export function getNetworks(){
    return [
        makeNetwork(arb),
        makeNetwork(avax),
        makeNetwork(bsc),
        makeNetwork(eth)
    ]
}