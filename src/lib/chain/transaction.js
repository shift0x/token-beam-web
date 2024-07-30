export async function sendTransaction(signer, to, data, value){
    const tx = { to }

    if(data)
        tx.data = data;

    if(value)
        tx.value = value;

    await signer.sendTransaction(tx);
}