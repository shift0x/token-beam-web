
import { ROUTE_SEGMENT } from "./routesegment";
import { getNetworkNativeToken } from "../network/networks";
import { getProvidersForSwap } from "./providers/providers";

export const CROSS_NETWORK = "cross";


const baseNetwork = getNetworkNativeToken("1");

function makeRoutes(from, to) {
    const isCrossNetworkSwap = from.network.chainId != to.network.chainId

    const tokenToNative = from.token.isNative ? null : { segment: ROUTE_SEGMENT.tokenToNative, from: from.token, to: from.network.native };
    const nativeToToken = to.token.isNative ? null : { segment: ROUTE_SEGMENT.nativeToToken, from: to.network.native, to: to.token };
    const crossNetwork = !isCrossNetworkSwap ? [] : [
        [
            { segment: ROUTE_SEGMENT.crosschainNativeToNative, from: from.network.native, to: to.network.native }
        ]
    ];

    const crossNetworkMultiHop = [
        { segment: ROUTE_SEGMENT.crosschainNativeToNative, from: from.network.native, to: baseNetwork },
        { segment: ROUTE_SEGMENT.crosschainNativeToNative, from: baseNetwork, to: to.network.native }
    ].filter(path => { return path.from.id != path.to.id})

    if(crossNetworkMultiHop.length > 1) {
        crossNetwork.push(crossNetworkMultiHop);
    }

    if(!from.token.isNative && isCrossNetworkSwap) {
        crossNetwork.push([
            { segment: ROUTE_SEGMENT.crosschainTokenToNative, from: from.token, to: baseNetwork },
            { segment: ROUTE_SEGMENT.crosschainNativeToNative, from: baseNetwork, to: to.network.native }
        ].filter(path => { return path.from.id != path.to.id}))
    }

    if(!to.token.isNative && isCrossNetworkSwap) {
        crossNetwork.push([
            { segment: ROUTE_SEGMENT.crosschainNativeToNative, from: from.network.native, to: baseNetwork },
            { segment: ROUTE_SEGMENT.crosschainNativeToToken, from: baseNetwork, to: to.token }
        ].filter(path => { return path.from.id != path.to.id}))
    }

    if(!from.token.isNative && !to.token.isNative && isCrossNetworkSwap && from.token.chainId != baseNetwork.chainId) {
        crossNetwork.push([
            { segment: ROUTE_SEGMENT.crosschainTokenToNative, from: from.token, to: baseNetwork },
            { segment: ROUTE_SEGMENT.crosschainNativeToToken, from: baseNetwork, to: to.token }
        ])
    }

    const routes = [];
    

    if(!from.token.isNative && !to.token.isNative && isCrossNetworkSwap) {
        routes.push([ { segment: ROUTE_SEGMENT.crosschainTokenToToken, from: from.token, to: to.token } ])
    } else if(from.token.isNative && !to.token.isNative && isCrossNetworkSwap){
        routes.push([ { segment: ROUTE_SEGMENT.crosschainNativeToToken, from: from.token, to: to.token } ])
    } else if(!from.token.isNative && to.token.isNative && isCrossNetworkSwap){
        routes.push([ { segment: ROUTE_SEGMENT.crosschainNativeToToken, from: from.token, to: to.token } ])
    } else if (!isCrossNetworkSwap){
        routes.push([ tokenToNative, nativeToToken].filter(swap => { return swap != null }));
    }
    

    crossNetwork.forEach(path => {
        let route = [];

        if(tokenToNative != null && path[0].from.id != tokenToNative.from.id) {
            route.push(tokenToNative)
        }

        route = route.concat(path);

        if(nativeToToken != null && path[path.length-1].to.id != nativeToToken.to.id) {
            route.push(nativeToToken);
        }

        routes.push(route);
    })

    return routes;
}

function filterQuoteableRoutes(routes) {
    const quotables = [];

    routes.forEach(route => {
        let canQuote = true;

        route.forEach(swap => {
            swap.providers = getProvidersForSwap(swap);

            if(swap.providers.length == 0) {
                canQuote = false;
            }
        });

        if(canQuote){
            quotables.push(route);
        }
    });

    return quotables;
}

export function getRoutes(from, to){
    const routes = makeRoutes(from, to);
    const quoteableRoutes = filterQuoteableRoutes(routes);

    return quoteableRoutes
}