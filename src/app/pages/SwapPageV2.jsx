import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import StyledBox from '../../components/StyledBox';
import SwapBuilder from '../../features/swap-builder/SwapBuilder';
import Hero from '../../components/Hero';
import LogoCollection from '../../components/LogoCollection';
import { Box } from '@mui/material';


export default function SwapPageV2() {

  return (
    <Container sx={{ pt: { xs: 2, sm: 4 }, }}>
        <Hero />
        <Grid container spacing={6}>
            <StyledBox>
                <SwapBuilder />
            </StyledBox>
        </Grid>
        <Box sx={{ width: "70%", pt: 7, margin: "auto"}}>
            <LogoCollection  />    
        </Box>
    </Container>
    
  );
}
