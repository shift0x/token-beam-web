import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import swap from '../assets/images/swap.png';
import LogoCollection from './LogoCollection';
import { Link } from "react-router-dom";
import StyledBox from './StyledBox';


export default function Hero() {
  return (
    <Box id="hero">
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 2, sm: 4 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
            }}
          >
            Any Token &nbsp;
            <img
              src={swap}
              style={{ maxWidth: '40px'}}
            /> &nbsp;

            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              Any Chain
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Remove complexity and break free from blockchain silos. Swap any token between chains in just a few clicks. 
            Complex and slow just became fast and easy. Ready to earn? Join the affiliate program and earn .05% on each swap you refer.
          </Typography>
          <LogoCollection />
          <Box display="flex" justifyContent="center" alignItems="center" gap={2} width="100%">
            <Button variant="contained" sx={{ width: '30%' }} component={Link} to="/swap">Swap</Button>
            <Button variant="contained" sx={{ width: '30%' }} component={Link} to="/affiliates">Become an Affiliate</Button>
          </Box>
          
        </Stack>
        <StyledBox id="image" height="700px" />
      </Container>
    </Box>
  );
}
