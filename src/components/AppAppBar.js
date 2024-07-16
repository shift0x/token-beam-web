import * as React from 'react';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Link, useLocation } from "react-router-dom";

import Sitemark from './SitemarkIcon';
import { scrollToSection } from '../lib/navigation';
import Web3WalletConnection from '../features/web3-wallet-connection/Web3WalletConnection';


function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const { pathname } = useLocation();
  const isHomePage = pathname == "/";

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scroll = (sectionId) => {
    scrollToSection(sectionId, () => {
      setOpen(false);
    })
  };


  return (
    <AppBar
      position="fixed"
      sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 2 }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderRadius: '999px',
            backdropFilter: 'blur(24px)',
            maxHeight: 40,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'hsla(220, 60%, 99%, 0.6)',
            boxShadow:
              '0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)',
            ...theme.applyStyles('dark', {
              bgcolor: 'hsla(220, 0%, 0%, 0.7)',
              boxShadow:
                '0 1px 2px hsla(210, 0%, 0%, 0.5), 0 2px 12px hsla(210, 100%, 25%, 0.3)',
            }),
          })}
        >
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Link to="/" style={{paddingTop: "5px"}}>
              <Sitemark />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => scroll('howtoswap')}
              >
                How to Swap
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => scroll('testimonials')}
              >
                Testimonials
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => scroll('highlights')}
              >
                Highlights
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => scroll('pricing')}
              >
                Pricing
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => scroll('faq')}
                sx={{ minWidth: 0 }}
              >
                FAQ
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              alignItems: 'center',
            }}
          >
          { isHomePage ? (
            <Container>
              <Button color="primary" variant="text" size="small" component={Link} to="/affiliates">
                Affiliates
              </Button>
              <Button color="primary" variant="contained" size="small" component={Link} to="/swap">
                Swap
              </Button>
            </Container>
          ) : <Web3WalletConnection active={true} /> }


            
          </Box>
          <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                <MenuItem onClick={() => scroll('features')}>
                  Features
                </MenuItem>
                <MenuItem onClick={() => scroll('testimonials')}>
                  Testimonials
                </MenuItem>
                <MenuItem onClick={() => scroll('highlights')}>
                  Highlights
                </MenuItem>
                <MenuItem onClick={() => scroll('pricing')}>
                  Pricing
                </MenuItem>
                <MenuItem onClick={() => scroll('faq')}>FAQ</MenuItem>
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}


export default AppAppBar;
