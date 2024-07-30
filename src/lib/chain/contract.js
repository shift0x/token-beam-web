import { providers, utils } from 'ethers'

export function makeCalldata(abi, method, ...args){
    const iface = new utils.Interface(abi);
    const fragment = iface.getFunction(method);

    return iface.encodeFunctionData(fragment, args);
}

export async function callContract(rpc, abi, address, method, ...args){
    const provider = new providers.JsonRpcProvider(rpc);

    const iface = new utils.Interface(abi);
    const fragment = iface.getFunction(method);
    const calldata = iface.encodeFunctionData(fragment, args);

    const rawResult = await provider.call({ to: address, data: calldata});
    const result = iface.decodeFunctionResult(fragment, rawResult);

    return result;
}