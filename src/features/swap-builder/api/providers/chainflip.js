import { canProviderSwapTokens, numberFromBig, numberToBig } from "./utils";
import { ChainflipList } from "@swapkit/tokens";

const ERROR_CCM_NOT_SUPPORTED = "ccm not yet supported"

const quoteApiBaseUrl = "https://token-beam-api.vercel.app/api"

const providerId = "chainflip"

function canQuote(swap){
    return canProviderSwapTokens(swap.from.id, swap.to.id, ChainflipList.tokens)
}

async function createBaseQuoteParams(swap, amountIn, method){
    console.log({swap, amountIn})
    
    const amountInBig = await numberToBig(swap.from, amountIn);

    return {
        method: method,
        amount: amountInBig,
        from: swap.from.id.split("-")[0],
        to: swap.to.id.split("-")[0],
        network: "mainnet"
    }
}

async function quote(swap, amountIn){
    const result = { amountOut: -1, provider: ChainFlipProvider }
    const params = await createBaseQuoteParams(swap, amountIn, "chainflip.getPrice");
    
    if(params.amount == null){ return result; }

    try {
        const searchParams = new URLSearchParams(params);
        const response = await fetch(`${quoteApiBaseUrl}/execute?${searchParams}`);
        const body = await response.json();

        if(body.error != null){ throw body.error; }
    
        result.amountOut = await numberFromBig(swap.to, body.data.amountOut)
        result.route = body.data
        result.data = body
    } catch(err){
        result.error = err
    } finally {
        return result
    }
}

async function getSummary(operation, prev, next) {
    // 1. Approve chainflip router if input token is an ERC20

    // 2. Send tokens / native asset to destination address
}

async function execute(operation, prev, next){
    

}


async function createOperation(swap, prev, next, to, amountIn){
    const params = await createBaseQuoteParams(swap, amountIn, "chainflip.getDepositAddress")
    const operation = {};

    if(!next){
        params.destinationAddress = to;
    } else {
        operation.error = ERROR_CCM_NOT_SUPPORTED

        return operation
    }

    try {
        const searchParams = new URLSearchParams(params);
        const response = await fetch(`${quoteApiBaseUrl}/execute?${searchParams}`);
        const body = await response.json();

        if(body.error != null){ throw body.error; }
    
        operation.metadata = body.data;
        operation.getDestinationAddress = () => { return  operation.metadata.destAddress;  }
        operation.getSummary = (prevOp, nextOp) => { return getSummary(operation, prevOp, nextOp); }
        operation.execute = (prevOp, nextOp) => { return execute(operation, prevOp, nextOp); }
    } catch(err){
        operation.error = err
    } finally {
        return operation;
    }
}

export const ChainFlipProvider = {
    canQuote,
    quote,
    providerId,
    createOperation,
}