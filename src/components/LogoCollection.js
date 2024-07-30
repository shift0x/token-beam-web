import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import chainflip from '../assets/images/chainflip_logo.png'
import swapkit from '../assets/images/swapkit_logo.png'
import thorchain from '../assets/images/thorchain_logo.png'
import maya from '../assets/images/maya_logo.png'

const logos = [ chainflip, thorchain, maya, swapkit ];

const logoStyle = {
  "maxWidth": '400px',
  "maxHeight": '30px',
  margin: '0 32px',
  opacity: 0.95,
};

export default function LogoCollection() {
  return (
    <Box id="logoCollection" sx={{ paddingTop: '12px'  }}>
      <Typography
        component="p"
        variant="caption"
        align="center"
        sx={{ color: 'text.secondary'}}
      >
        Powered by
      </Typography>
      <Grid container sx={{ justifyContent: 'center', mt: 1.5, opacity: 0.95, paddingTop: '4px' }}>
        {logos.map((logo, index) => (
          <Grid item key={index} style={{margin: 'auto'}}>
            <img
              src={logo}
              alt={`partner ${index + 1}`}
              style={logoStyle}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
