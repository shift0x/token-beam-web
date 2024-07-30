import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import StyledBox from '../../components/StyledBox';
import SwapBuilder from '../../features/swap-builder/SwapBuilder';
import Hero from '../../components/Hero';
import LogoCollection from '../../components/LogoCollection';
import { Box } from '@mui/material';
import NetworkSelector from '../../components/NetworkSelector';
import { useState } from 'react';



export default function SwapPage() {

  const [network, setNetwork] = useState("mainnet")

  function onNetworkChanged(value){
    setNetwork(value)
  }

  return (
    <Container sx={{ pt: { xs: 2, sm: 4 }, }}>
        <Hero />
        <NetworkSelector network={network} onNetworkChanged={onNetworkChanged} />
        <Grid container spacing={2}>
            <StyledBox>
                <SwapBuilder network={network} />
            </StyledBox>
        </Grid>
        <Box sx={{ width: "90%", pt: 5, margin: "auto"}}>
            <LogoCollection  />    
        </Box>
    </Container>
    
  );
}
