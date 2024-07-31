import { getRPC } from "../chain/rpc";
import { callContract, makeCalldata } from '../chain/contract';
import erc20 from './abi.json';

const erc20TokenDecimalCache = {}

export async function getERC20TokenDecimals(chainId, address){
    const id = `${chainId}.${address}`
    const decimals = erc20TokenDecimalCache[id];

    if(decimals)
        return decimals;

    const rpc = getRPC(chainId);
    const result = await callContract(rpc, erc20, address, "decimals");

    erc20TokenDecimalCache[id] = result[0];

    return result[0];
}

export async function transferERC20Token(to, amountBig){
    return makeCalldata(erc20, "transfer", to, amountBig);
}

export async function approveERC20TokenCalldata(spender, cap){
    if(!cap)
        cap = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    
    return makeCalldata(erc20, "approve", spender, cap)
}