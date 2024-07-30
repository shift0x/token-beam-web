import { getRPC } from "../chain/rpc";
import { callContract, makeCalldata } from '../chain/contract';
import erc20 from './abi.json';

export async function getERC20TokenDecimals(chainId, address){
    const rpc = getRPC(chainId);
    const result = await callContract(rpc, erc20, address, "decimals");

    return result[0];
}

export async function transferERC20Token(token, to, amountBig){
    return makeCalldata(erc20, token, to, amountBig);
}