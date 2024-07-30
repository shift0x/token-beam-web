import { getERC20TokenDecimals } from "../../../lib/erc20/erc20";

export async function getTokenDecimalsFromChain(token) {
    return getERC20TokenDecimals(token.chainId, token.address);
}

export async function getTokenDecimalsFromApi(token){
    const network = token.external.coingecko.networkId;
    const address = token.address;

    const url = `https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${address}`
    

    try {
        const response = await fetch(url);
        const body = await response.json();

        return body.data.attributes.decimals;
    } catch(err) {
        return null;
    }
}