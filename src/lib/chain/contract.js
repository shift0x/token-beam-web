import { providers, utils } from 'ethers'

export async function callContract(rpc, abi, address, method, ...args){

    const provider = new providers.JsonRpcProvider(rpc);
    const iface = new utils.Interface(abi);
    const fragment = iface.getFunction(method);
    const calldata = iface.encodeFunctionData(fragment, args);

    const rawResult = await provider.call({ to: address, data: calldata});

    console.log(rawResult);

    const result = iface.decodeFunctionResult(fragment, rawResult);

    console.log(result);

    return result;
}