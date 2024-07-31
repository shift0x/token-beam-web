import { Avatar, Box, Button, Grid, Input, List, ListItem, ListItemAvatar, Popover, Stack, Typography, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo, useRef } from 'react';
import { useEffect, useState } from 'react';


function SwapWaypoint({label, details, networks, update, readonly, loading}){
    const [anchorEl, setAnchorEl] = useState(null)

    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(-1);
    const [selectedToken, setSelectedToken] = useState(null);
    const [selectedNetworkTokens, setNetworkTokens] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [swapAmount, setSwapAmount] = useState(0);
    const [isValidAmount,setIsValidAmount] = useState(true);
    const amountInputRef = useRef(null)
    
    

    const selectedTokenId = selectedToken ? selectedToken.id : -1;
    var selectedNetwork = selectedNetworkIndex !==-1 ? networks[selectedNetworkIndex] : null;
    const canSearch = selectedNetworkIndex !==-1;

    const networkUUID = useMemo(() => {
        const ids = networks
            .map(network => { return network.chainId })
            .sort((x,y) => { return x > y ? 1 : -1})

        return ids.join("::")
    })

    useEffect(() => {
        setSelectedNetworkIndex(-1)
        setSelectedToken(null)
        setSearchText("");
        setSwapAmount(0);

        clearAmountInput();
        
        selectedNetwork = null;

        update({ network: null, token: null, amount: swapAmount})
    }, [networkUUID])

    useEffect(() => {
        if(selectedNetworkIndex == -1) {
            setNetworkTokens([]);

            return;
        }
       
        const searchValue = searchText.toLowerCase().trim();
        const selectedNetwork = networks[selectedNetworkIndex];

        if(!selectedNetwork) 
            return
        
        let allTokens =  selectedNetwork.tokens;

        let filteredTokens = allTokens
            .filter((token) => {
                const isEmptySearch = searchText.trim().length ===0 
                const isNameMatch = token.name && token.name.toLowerCase().indexOf(searchValue) !==-1
                const isSymbolMatch = token.symbol && token.symbol.toLowerCase().indexOf(searchValue) !==-1
                const isAddressMatch = token.address && token.address.toLowerCase().indexOf(searchValue) !==-1

                return isEmptySearch || isNameMatch || isSymbolMatch || isAddressMatch;
            });


        setNetworkTokens(filteredTokens.splice(0, 100));
    }, [selectedNetworkIndex, searchText, networkUUID])


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function clearAmountInput(){
        setSwapAmount(0);

        if(amountInputRef.current){
            const elem = amountInputRef.current.children && amountInputRef.current.children.length > 0 ? amountInputRef.current.children[amountInputRef.current.children.length-1] :amountInputRef.current;
            elem.value = "" 
        }
    }

    function handleNetworkClicked(index) {
        setSelectedNetworkIndex(index);
        setSelectedToken(null);
        setSearchText("")
        clearAmountInput();
    }

    function handleTokenClicked(token) {
        setSelectedToken(token);
        setAnchorEl(null);
        clearAmountInput();

        update({ network: selectedNetwork, token: token, amount: swapAmount});
    }

    function handleKeyPressed(e){
        if(e.key == "Enter"){
            handleSwapAmountChanged(e.target.value)
        }
    }

    function handleSwapAmountChanged(amount) {
        const amountAsNumber = amount.replace(/,/g, '');


        if(isNaN(amountAsNumber)){ 
            setIsValidAmount(false);

            return; 
        }

        setIsValidAmount(true);
        setSwapAmount(amountAsNumber);

        update({ network: selectedNetwork, token: selectedToken, amount: Number(amountAsNumber)});
    }


    const open = Boolean(anchorEl);
    const id = open ? 'choose-network-token' : undefined;

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="caption" sx={{ color: 'darkgray'}}>{label}</Typography>
                    { selectedNetwork != null ? 
                        <Box sx={{ display: "inline-flex", ml: 1 }}>
                            <Avatar src={selectedNetwork.icon} sx={{width: "20px", height: "20px"}} />
                        </Box> : null
                    }
                </Box>
                <Box sx={{ textAlign: 'left', mt: 2 }} >
                    <Button id={id} variant="contained" onClick={handleClick} sx={{
                            borderRadius: "24px",
                            boxShadow: selectedTokenId !==-1 ? 
                                "unset":
                                "inset 0 2px 0 hsla(210, 100%, 80%, 0.2),inset 0 -2px 0 hsla(210, 100%, 35%, 0.4)",
                            border: selectedTokenId !==-1 ?
                                "1px solid hsl(0, 0%, 82%)":
                                "1px solid hsl(210, 98%, 42%)",
                            backgroundColor: selectedTokenId !==-1 ?
                                "hsl(0, 0%, 98%)":
                                "hsl(210, 100%, 65%)",
                            backgroundImage: selectedTokenId !==-1 ?  
                                "linear-gradient(to bottom, hsla(0, 0%, 99%), hsl(0, 0%, 98%))" : 
                                "linear-gradient(to bottom, hsla(210, 98%, 48%, 0.8), hsl(210, 98%, 42%))"
                        }}>

                        { selectedTokenId === -1 ? <>Choose a token</>:
                            <>
                                <Avatar src={selectedToken.icon} sx={{width: "25px", height: "25px", padding: "2px"}} />
                                <span style={{color: "#000", fontWeight: "600", fontSize: "12px", textTransform: "uppercase"}}>{selectedToken.symbol ?? selectedToken.name} </span>
                                
                            </>
                        }   
                    </Button>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                        sx={{ mt: 2,}}
                        slotProps={{ paper: {
                            style: { 
                                borderRadius: "12px",
                            }
                        } }}
                       >
                        <Box sx={{
                            backgroundColor: "#fff",
                            width: "350px",
                        }}>
                            <Stack sx={{ pt: 2}}> 
                                <Box sx={{
                                    backgroundColor: "#fff",
                                    pl: 2,
                                    pr: 2,
                                    pb: 2
                                }}>
                                    {networks.map(( network , index) => (
                                        <Box id={index} sx={{
                                                padding: "5px",
                                                ml: "5px",
                                                marginTop: "10px",
                                                display: "inline-flex",
                                                border: "2px solid #eee",
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                backgroundColor: selectedNetworkIndex ===index ? '#e2f0fe' : '#fcfcfc',
                                            }}

                                            onClick={ () => handleNetworkClicked(index)}
                                        >
                                                <img loading='lazy'  
                                                    src={network.icon} 
                                                    height="30px"
                                                    width="30px"
                                                    sx={{
                                                        padding: "5px",
                                                        marginLeft: "10px",
                                                        border: "1px solid #000"
                                                    }}
                                                />
                                        </Box>
                                    ))}

                                    { canSearch ?
                                        <>
                                            <Box sx={{
                                                marginTop: "10px",
                                                textAlign: "center"
                                            }}>
                                                <Input type="text" placeholder="search" value={searchText} sx={{ 
                                                    backgroundColor: "#e2f0fe",
                                                    borderRadius: "5px",
                                                    color: "#000",
                                                    width: "80%",
                                                    margin: "auto",
                                                    padding: 1
                                                }} onChange={ e => setSearchText(e.target.value)} />
                                            </Box>
                                        </>
                                         : null
                                    }
                                    
                                </Box>
                                <Box sx={{
                                    maxHeight: "300px",
                                    overflow: "scroll",
                                    backgroundColor: "#fafafa"
                                }}>
                                    <List sx={{pt:0}}>
                                        {selectedNetworkTokens.map(( token ) => (
                                            <ListItem id={`${token.chainId}.${token.id}`} sx={{
                                                borderBottom: "1px solid #efefef",
                                                cursor: "pointer",
                                                transition: 'all 0.3s',
                                                pt: 1.5,
                                                pb: 1.5,
                                                backgroundColor: token.id === selectedTokenId ? "#e2f0fe" : "inherit",
                                                '&:hover': {
                                                    backgroundColor: '#e2f0fe',
                                                }
                                            }}

                                            onClick={ () => handleTokenClicked(token)}>
                                                <ListItemAvatar>
                                                    <Avatar src={token.icon} sx={{width: "30px", height: "30px"}} />
                                                </ListItemAvatar>
                                                <Typography sx={{ color: "#000"}}>
                                                    {token.name}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                   
                                </Box>
                            </Stack>
                        </Box>
                    </Popover>
                </Box>
            </Grid>

            <Grid item xs={6} sx={{ pr: 2}}>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: 'darkgray'}}>amount</Typography>
                </Box>
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                    { loading ? 
                        <Skeleton /> :

                        <>
                        { readonly ? 
                            <Box sx={{ marginTop: "5px"}}>
                                {
                                    details.amount > 1 ? 
                                        details.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) :
                                        details.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6})
                                }
                            </Box> :

                            <Input
                                ref={amountInputRef}
                                type='text'
                                readOnly={readonly}
                                sx={{
                                    border: !isValidAmount ? "3px solid red" : "none",
                                    padding: "5px"
                                }}
                                onKeyUp={ e => handleKeyPressed(e)}
                                onBlur={ e => handleSwapAmountChanged(e.target.value)}  /> 
                        }

                        </>
                    }
                        
                    
                </Box>
            </Grid>
        </Grid>
    )
}   

SwapWaypoint.propTypes = {
    label: PropTypes.string.isRequired,
    details: PropTypes.PropTypes.object.isRequired,
    networks: PropTypes.arrayOf(PropTypes.object).isRequired,
    update: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired
};

export default SwapWaypoint;