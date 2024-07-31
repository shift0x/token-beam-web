import arb from '../../stores/tokens/arbitrum-one.json'
import avax from '../../stores/tokens/avalanche.json'
import bsc from '../../stores/tokens/binance-smart-chain.json'
import eth from '../../stores/tokens/ethereum.json'
import defaults from './network-defaults.json'

const networks = {};

function makeToken(network, token){
    const chain = network.native.id.split(".")[0]
    const id = `${chain}.${token.symbol}-${token.address}`.toUpperCase()

    return {
        id: id,
        chainId: network.chainId,
        symbol: token.symbol.toUpperCase(),
        name: token.name,
        icon: token.image,
        address: token.address,
        networkIcon: network.icon,
        networkName: network.name,
        external: {
            coingecko: {
                id: token.id,
                marketCap: token.market_cap,
                marketCapRank: token.market_cap_rank,
                networkId: network.external.coingecko.networkId
            }
        },
    }
}


function makeNetwork(base){
    const network = { ...base, ...defaults[base.id]}

    network.tokens = (network.tokens ?? []).map(token => {
        return makeToken(network, token);
    }).sort((x,y) => { 
        return x.external.coingecko.marketCap < y.external.coingecko.marketCap ? 1 : -1;
    });

    
    network.native = makeNetworkNativeToken(network);
    network.tokens = [ network.native, ...network.tokens];

    networks[network.chainId] = network;

    return network;
}

function makeNetworkNativeToken(network) {
    const symbol = network.native.id.split(".")[1].toUpperCase()

    return {
        id: network.native.id,
        chainId: network.chainId,
        symbol: symbol,
        name: `${symbol} (Native)`,
        icon: network.native.icon,
        networkIcon: network.icon,
        networkName: network.name,
        isNative: true,
        external: {}
    }
}

function init(){
    makeNetwork({id: "bitcoin"})
    makeNetwork(eth)
    makeNetwork(arb)
    makeNetwork(avax)
    makeNetwork(bsc)
    makeNetwork({id: "ethereum-sepolia"})
    makeNetwork({id: "arbitrum-sepolia"})
}

export function getNetworks(type){
    const result = Object
        .keys(networks)
        .map(id => { return networks[id]})
        .filter(network => { return network.network ===type});

    return result;
}

export function getNetworkNativeToken(chainId){
    const network = networks[chainId];

    return network.native;
}

export function getTokenChain(token){
    return token.id.split(".")[0]
}

export function getTokenAddress(token){
    const nativeTokenAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

    if(token.isNative){
        return nativeTokenAddress
    }

    return token.address;
}

init();

