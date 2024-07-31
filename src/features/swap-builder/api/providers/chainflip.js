import { sendTransaction } from "../../../../lib/chain/transaction";
import { transferERC20Token } from "../../../../lib/erc20/erc20";
import { canProviderSwapTokens, numberFromBig, numberToBig } from "./utils";
import { ChainflipList } from "@swapkit/tokens";
import logo from '../../../../assets/images/chainflip_logo_sm.png'

const ERROR_CCM_NOT_SUPPORTED = "ccm not yet supported"

const quoteApiBaseUrl = "https://token-beam-api.vercel.app/api"

const providerId = "chainflip"

function canQuote(swap, network){
    return network ==="testnet" || canProviderSwapTokens(swap.from.id, swap.to.id, ChainflipList.tokens)
}

async function createBaseQuoteParams(swap, amountIn, method, network){
    const amountInBig = await numberToBig(swap.from, amountIn);

    return {
        method: method,
        amount: amountInBig,
        from: swap.from.id.split("-")[0],
        to: swap.to.id.split("-")[0],
        network: network
    }
}

async function quote(swap, amountIn, network){
    
    const result = { amountOut: -1, provider: ChainFlipProvider }
    const params = await createBaseQuoteParams(swap, amountIn, "chainflip.getPrice", network);
    
    if(params.amount ===null){ return result; }

    try {
        const searchParams = new URLSearchParams(params);
        const response = await fetch(`${quoteApiBaseUrl}/execute?${searchParams}`);
        const body = await response.json();

        if(body.error !==null){ throw body.error; }
    
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

async function execute(signer, operation, prev, next){
    const depositAddress = operation.metadata.depositAddress
    const amount = operation.metadata.amount;
    const from = operation.swap.from;

    const to = from.isNative ? depositAddress : from.address;
    const calldata = from.isNative ? null : await transferERC20Token(depositAddress, amount);
    const value = from.isNative ? amount : null;
    
    await sendTransaction(signer, to, calldata, value);
}


async function createOperation(swap, prev, next, to, amountIn, network){
    const params = await createBaseQuoteParams(swap, amountIn, "chainflip.getDepositAddress", network)
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

        if(body.error !==null){ throw body.error; }
    
        operation.metadata = body.data;
        operation.swap = swap;
        operation.getDestinationAddress = () => { return  operation.metadata.destAddress;  }
        operation.getSummary = (prevOp, nextOp) => { return getSummary(operation, prevOp, nextOp); }
        operation.execute = (signer, prevOp, nextOp) => { return execute(signer, operation, prevOp, nextOp); }
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
    logo,
}