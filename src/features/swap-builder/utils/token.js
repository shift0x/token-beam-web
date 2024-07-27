
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