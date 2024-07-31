import { approveERC20TokenCalldata, transferERC20Token } from "../../../../lib/erc20/erc20";
import { getTokenAddress, getTokenChain } from "../network/networks";
import { ROUTE_SEGMENT } from "../router/routesegment";
import { numberFromBig, numberToBig } from "./utils";
import { sendTransaction } from "../../../../lib/chain/transaction";

const providerId = "0x";
const endpoints = {
    "1": "https://api.0x.org",
    "42161": "https://arbitrum.api.0x.org",
    "43114": "https://avalanche.api.0x.org",
    "56": "https://bsc.api.0x.org",
    "11155111": "https://sepolia.api.0x.org"
}

function canQuote(swap){
    const canQuoteSegment = swap.segment ===ROUTE_SEGMENT.tokenToNative

    if(!canQuoteSegment) { return false; }

    const fromChain = getTokenChain(swap.from)
    const toChain = getTokenChain(swap.to)

    if(fromChain !==toChain) { return false; }

    const endpoint = endpoints[swap.from.chainId];

    return endpoint !==null;
}

async function quote(swap, amountIn){
    return call(swap, amountIn, "price")
}

async function call(swap, amountIn, operation){
    const amountInBig = await numberToBig(swap.from, amountIn)

    const args = new URLSearchParams({
        sellToken: getTokenAddress(swap.from),
        buyToken: getTokenAddress(swap.to),
        sellAmount: amountInBig
    })

    const url = `${endpoints[swap.from.chainId]}/swap/v1/${operation}?${args}`
    const result = { amountOut: -1, provider: ZeroXProvider }

    try {
        const response = await fetch(url, {
            headers : {
                "0x-api-key": "32bf0773-ae1e-4389-ba61-34115a695dd3"
            }
        });
        const body = await response.json();

        if(body.error !==null){ throw body.error; }
    
        result.amountOut = await numberFromBig(swap.to, body.buyAmount)
        result.route = body
        result.data = body
    } catch(err){
        result.error = err
    } finally {
        return result
    }
}

async function execute(signer, operation, prev, next){
    for(var i =0; i < operation.transactions.length; i++){
        const op = operation.transactions[i];
        const tx = await sendTransaction(signer, op.to, op.data, op.value)

        await tx.wait();
    }
}

async function createOperation(swap, prev, next, to){
    // we need to execute 2 transactions
    // 1. approve the router
    // 2. execute the swap

    const amountIn = prev ? prev.result.amountOut : swap.quote.amountIn;
    const operation = { transactions: [] };
    const quoteResult = await call(swap, amountIn, "quote");

    console.log({quoteResult})

    if(!swap.from.isNative){
        operation.transactions.push({
            to: swap.from.address,
            data: await approveERC20TokenCalldata(quoteResult.data.allowanceTarget)
        })
    }

    operation.transactions.push({
        to: quoteResult.data.to,
        data: quoteResult.data.data,
    })

    operation.swap = swap;
    operation.execute = (signer, prevOp, nextOp) => { return execute(signer, operation, prevOp, nextOp); }

    return operation;
}

export const ZeroXProvider = {
    canQuote,
    quote,
    providerId,
    createOperation,
}