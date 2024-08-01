import { ChainFlipProvider } from "./chainflip";
import { gasFromBig, numberFromBig, numberToBig } from "./utils";
import tokenBeamExchangeAbi from './contracts/tokenbeamExchange.json'
import { estimateGasCost, getRPC } from "../../../../lib/chain/rpc";
import { callContract, estimateGas } from "../../../../lib/chain/contract";
import { ethers } from 'ethers';
import { getNetworkNativeToken, isNetworkSupportedByProvider } from "../network/networks";
import logo from '../../../../assets/images/tokenbeam_logo_sm.png'

const providerId = "tokenbeam"

const chains = {
    "42161": {
        weth: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
        exchanges: {
            uniswapV3: "0x739D6Fa1a77b9B226Fa2DaD62C49D72B0Fc31D9F"
        }
    },
    "421614": {},
    "11155111": {
        router: "0xBF90F0C5D30d2DebbC940369DA435687E4C2e701",
        weth: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
        exchanges: {
            uniswapV3: "0x861C552fFDD44c0953cc07F672d4c7CC7CdFF68a"
        }
    }
}

function isTokenSupported(token){
    const isNetworkSupportedByChainflip = isNetworkSupportedByProvider(token.chainId, ChainFlipProvider.providerId)
    
    if(token.isNative){ return isNetworkSupportedByChainflip; }

    const tokenBeamNetworkConfiguration = chains[token.chainId];

    return tokenBeamNetworkConfiguration && tokenBeamNetworkConfiguration.exchanges != null
}

function canQuote(swap){
    const isFromTokenSupported = isTokenSupported(swap.from);
    const isToTokenSupported = isTokenSupported(swap.to);

    if(swap.from.chainId != swap.to.chainId) { return false; }

    return isFromTokenSupported && isToTokenSupported;
}

async function createCrossChainMessage(fromProviderId, destinationAddress, execution){
    if(fromProviderId != ChainFlipProvider.providerId) { return null; }

    const gasEstimate = execution.metadata.gasEstimate * 2;
    const encoder = new ethers.utils.AbiCoder()

    const message = encoder.encode(["address", "address", "address", "address"], [
        destinationAddress,
        execution.metadata.tokenInAddress,
        execution.metadata.tokenOutAddress,
        execution.metadata.chainInfo.exchanges.uniswapV3
    ])

    const nativeToken = getNetworkNativeToken(execution.metadata.chainId);

    return {
        to: execution.metadata.chainInfo.router,
        message: message,
        gasBudget: await numberToBig(nativeToken, gasEstimate)
    }
}

async function quote(swap, amountIn){
    const result = { amountOut: -1, provider: TokenBeamProvider }

    if(!canQuote(swap)){ return result; }

    const swapArgs = {
        tokenIn: swap.from,
        tokenOut: swap.to,
        simulate: true,
        amountIn: amountIn,
        chainId: swap.from.chainId
    }

    const chainInfo = chains[swapArgs.chainId];

    if(!chainInfo || !chainInfo.exchanges) { return result; }

    swapArgs.amountIn = await numberToBig(swapArgs.tokenIn, swapArgs.amountIn);
    swapArgs.receiver = chainInfo.router ?? chainInfo.exchanges.uniswapV3;
    
    const tokenInAddress = swapArgs.tokenIn.isNative ? chainInfo.weth : swapArgs.tokenIn.address;
    const tokenOutAddress = swapArgs.tokenOut.isNative ? chainInfo.weth : swapArgs.tokenOut.address;
    const callArgs = [
        tokenInAddress, 
        tokenOutAddress, 
        swapArgs.amountIn, 
        swapArgs.simulate, 
        swapArgs.receiver
    ]
   
    try {
        const rpc = getRPC(swapArgs.chainId);
        const quote = await callContract(rpc, tokenBeamExchangeAbi, 
            chainInfo.exchanges.uniswapV3, 
            "swap", 
            ...callArgs);

        const gasEstimate = await estimateGas(rpc, tokenBeamExchangeAbi, chainInfo.exchanges.uniswapV3, "swap", ...callArgs);
        const amountOut = await numberFromBig(swapArgs.tokenOut, quote[0])


        result.metadata = { ...swapArgs, chainInfo, tokenInAddress, tokenOutAddress, gasEstimate, amountOut }
        result.amountOut = amountOut
    } catch(err){
        result.error = err
    } finally {
        return result;
    }
}

async function execute(signer, operation, prev, next) {

}

async function createOperation(swap, prev, next, to, amountIn, network){
    const operation = {
        metadata: swap.quote.execution.metadata,
        swap: swap
    }

    operation.execute = (signer, prevOp, nextOp) => { return execute(signer, operation, prevOp, nextOp); }

    return operation
}

export const TokenBeamProvider = {
    logo,
    canQuote,
    quote,
    providerId,
    createOperation,
    createCrossChainMessage
}