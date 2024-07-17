import { Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import SwapWaypoint from "./SwapWaypoint";
import { getNetworks } from "./api/networks";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


export default function SwapBuilder(){
  const [ fromDetails, updateFromDetails] = useState({amount:0, token: null, network: null, completed: false });
  const [ toDetails, updateToDetails] = useState({amount:0, token: null, network: null, completed: false });
  const networks = getNetworks();
  const dividerStyle = {
    bgcolor: 'white',
    borderRadius: '50%',
    padding: '1px',
    display: 'flex',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    background: 'linear-gradient(to bottom, #ffffff, #ccc)',
  };

  useEffect(() => {

  }, [fromDetails, toDetails])

  return (
    <>
        <Box 
            sx={(theme) => ({
            margin: { xs: 1, sm: 4},
            borderRadius: "10px",
            pt: { xs: 1, sm: 2 },
            pb: { xs: 1, sm: 2 },
            pl: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'hsla(220, 60%, 99%, 0.6)',
            boxShadow: '0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)',
            ...theme.applyStyles('dark', {
                bgcolor: 'hsla(220, 0%, 0%, 0.7)',
                boxShadow: '0 1px 2px hsla(210, 0%, 0%, 0.5), 0 2px 12px hsla(210, 100%, 25%, 0.3)'
                })
            })} >
            <SwapWaypoint label="from" networks={networks} details={fromDetails} update={updateFromDetails} />
            <Divider sx={{ my: 2 }}>
              <Box sx={dividerStyle}>
                <KeyboardArrowDownIcon color="primary" />
              </Box>
            </Divider>
            <SwapWaypoint label="to" networks={networks} details={toDetails} update={updateToDetails} />
        </Box>
      </>
  )
}