import { useState}  from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Avatar, AvatarGroup, Grid } from '@mui/material';
import { getNetworks } from '../features/swap-builder/api/network/networks';
import ReactRotatingText from 'react-rotating-text';
import {highlightedText} from '../assets/styles/highlight-text'

import './rotating-text.css'

export default function Hero() {
  const networks = getNetworks().filter(network => { return !network.testnet });
  const networkNames = networks.map(network => { return network.name});
  const [showRotatingChains, setShowRotatingChains] = useState(true);

  const networkAvatarStyle = {
      backgroundColor: "#fff",
      padding: "1px",
      height: "35px",
      width: "35px"
  }
 
  if(showRotatingChains){
    setTimeout(() => {
      setShowRotatingChains(false)
    }, 1000 * 20)
  }

  
  return (
    <Box id="hero">
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 1, sm: 1 },
          pb: { xs: 3, sm: 5 },
          pl: 0,
          pr: 0
        }}
      >
        <Stack
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '100%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: '3.5rem',
              fontFamily: "Poppins",
              fontWeight: 600
            }}
          >
            Swap 
            <span style={highlightedText}>&nbsp;Any Token&nbsp;</span> to 
            <Grid>
                <Box sx={{ 
                  ml: "10px", 
                  display: "inline-flex", 
                  borderBottom: showRotatingChains ? "5px solid #FFF" : "none", 
                  fontSize: "2.95rem",
                  width: showRotatingChains ? "300px" : "auto" }}>
                    {showRotatingChains ? 
                        <ReactRotatingText items={networkNames} /> : 
                        <AvatarGroup>
                            { 
                              networks.map(network => (
                                <>
                                  <Avatar src={network.icon} sx={networkAvatarStyle} />
                                </>
                                
                              ))
                            }
                            
                        </AvatarGroup>
                      }
                </Box>
            </Grid>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}