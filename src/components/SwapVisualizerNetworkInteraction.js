import React from 'react';
import PropTypes from 'prop-types';

import { Box, Typography, Divider, Grid, AvatarGroup, Avatar } from '@mui/material';
import {highlightedContainer, gradientContainer} from '../assets/styles/highlight-text'

const networkAvatarStyle = {
    backgroundColor: "#fff",
    padding: "3px",
    height: "20px",
    width: "20px"
}


const swapBoxStyle = {
    color: "#000",
    marginLeft: "10px",
    borderRadius: "15px",
    marginTop: "-4px",
    padding: "5px 15px",
    backgroundColor: "#fcfcfc",
    
}

const crosschainSwapStyle = {
  ...swapBoxStyle,
  ...highlightedContainer
}

const destinationTokenStyle = {
    ...swapBoxStyle,
    ...gradientContainer
}

function SwapVisualizerNetworkInteraction({network, displaySwapOutputs}){
    const lastswap = network.items[network.items.length-1];

    return (
            <Box display="flex" flexDirection="column" alignItems="center" sx={{margin: 3, marginLeft: 1}}>
                <Grid container spacing={2}>
                    <Box alignItems="center" justifyContent="center" sx={ {
                            ...destinationTokenStyle,
                            display: displaySwapOutputs ? "flex" : "none" 
                        }}>
                            <AvatarGroup>
                                <Avatar src={lastswap.to.icon} sx={networkAvatarStyle} />
                            </AvatarGroup>
                            
                            <Typography limit sx={{
                                ml: "5px",
                            }}>
                                {
                                    lastswap.quote.amountOut > 1 ? 
                                        lastswap.quote.amountOut.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) :
                                        lastswap.quote.amountOut.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6})
                                }
                            </Typography>
                    </Box>
                    <Box sx={{
                        display: displaySwapOutputs ? "none" : "inherit"
                    }}>
                        {network.items.map((swap, index) => (
                        <>
                            <Box alignItems="center" justifyContent="center" sx={ {
                                ...swapBoxStyle,
                                display: index ===0 ? "flex" : "none"
                            }}>
                                <AvatarGroup>
                                    <Avatar src={swap.from.icon} sx={networkAvatarStyle} />
                                </AvatarGroup>
                                
                                <Typography limit sx={{
                                    ml: "5px",
                                }}>
                                    {swap.quote.amountIn.toString().slice(0, 8)}
                                </Typography>
                            </Box> 

                            <Box display="flex" alignItems="center" justifyContent="center" sx={
                                swap.from.chainId !== swap.to.chainId ? crosschainSwapStyle : swapBoxStyle
                            }>
                                <AvatarGroup>
                                    <Avatar src={swap.from.icon} sx={networkAvatarStyle} />
                                    <Avatar src={swap.to.icon} sx={networkAvatarStyle} />
                                </AvatarGroup>
                                <span>
                                    &nbsp;
                                    { swap.from.chainId !== swap.to.chainId ? "crosschain via": "via" }
                                    &nbsp; </span>
                                {swap.quote.execution.provider.providerId}
                                
                            </Box>

                            {(index + 1) % 4 === 0 && <Grid item xs={12}><Divider style={{ margin: '16px 0' }} /></Grid>}
                        </>
                    ))}
                    </Box>
                    
                </Grid>
            </Box>
    )
}

SwapVisualizerNetworkInteraction.propTypes = {
    network: PropTypes.object.isRequired,
    displaySwapOutputs: PropTypes.bool.isRequired,
};

export default SwapVisualizerNetworkInteraction