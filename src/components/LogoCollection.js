import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import chainflip from '../assets/images/chainflip_logo.png'
import zerox from '../assets/images/0x_logo.png'
import thorchain from '../assets/images/thorchain_logo.png'

const logos = [ chainflip, thorchain, zerox ];

const logoStyle = {
  "maxWidth": '500px',
  "maxHeight": '50px',
  margin: '0 32px',
  opacity: 0.95,
};

export default function LogoCollection() {
  return (
    <Box id="logoCollection" sx={{ py: 4, paddingTop: '12px'  }}>
      <Typography
        component="p"
        variant="caption"
        align="center"
        sx={{ color: 'text.secondary'}}
      >
        Powered by
      </Typography>
      <Grid container sx={{ justifyContent: 'center', mt: 0.5, opacity: 0.95, paddingTop: '4px' }}>
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
