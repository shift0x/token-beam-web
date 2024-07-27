import { Box, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SwapWaypoint from "./SwapWaypoint";
import { getNetworks } from "./api/network/networks";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SwapExecutor from "./SwapExecutor";
import SwapsVisualizer from "../../components/SwapVisualizer";

const dividerStyle = {
  bgcolor: 'white',
  borderRadius: '50%',
  padding: '1px',
  display: 'flex',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  background: 'linear-gradient(to bottom, #ffffff, #ccc)',
};

const boxContentsStyle = (theme) => ({
  margin: { xs: .1, sm: .2},
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
})

const boxHeadingStyle = {
  color: "#fcfcfc",
  textAlign: "center",
  fontSize: ".85rem",
  textTransform: "uppercase",
  fontWeight: "bold"
}

export default function SwapBuilder(){
  const [ fromDetails, updateFromDetails] = useState({amount:0, token: null, network: null });
  const [ toDetails, updateToDetails] = useState({amount:0, token: null, network: null });
  const [ allSwapRoutes, setSwapRoutes] = useState([]);
  const [ selectedRoute, setSelectedRoute] = useState(null);
  const [ isBuildingRoutes, setIsBuildingRoutes] = useState(false);
  const [ quoteErrorMessage, setQuoteErrorMessage] = useState(null);

  const networks = getNetworks();

  useEffect(() => {
    setTimeout(() => {
      setIsBuildingRoutes(false);

      const optimalRoute = allSwapRoutes[0];
      const errorMessage = !optimalRoute ? "no routes found between assets" : optimalRoute.amountOut == 0 ? "input amount is too small or too large" : null;


      setSelectedRoute(optimalRoute);
      setQuoteErrorMessage(errorMessage);
    }, 1000 * 2)  
  }, [allSwapRoutes]);
  

  return (
    <>
      <Grid container spacing={2}>
        <Grid item style={{width: "400px", minHeight: "500px"}}>
          <Box 
              sx={boxContentsStyle}
              style={{minHeight:"483px"}} >
              <Typography variant="h4" sx={boxHeadingStyle}>
                Swap
              </Typography>
              <SwapWaypoint label="from" networks={networks} details={fromDetails} update={updateFromDetails} readonly={false} />
              <Divider sx={{ my: 2 }}>
                <Box sx={dividerStyle}>
                  <KeyboardArrowDownIcon color="primary" />
                </Box>
              </Divider>
              <SwapWaypoint label="to" networks={networks} details={toDetails} update={updateToDetails} readonly={true} />
              <Divider sx={{ my: 2 }} />
              <Box sx={{
                textAlign: "center",
                mt: 6
              }}>
                <Button variant="outlined" disableElevation disabled={ isBuildingRoutes || !selectedRoute } sx={{
                    width: "80%",
                    margin: "auto",
                    borderRadius: "24px",
                    padding: 2.5,
                    fontSize: "1rem"
                }}>
                    { !isBuildingRoutes ? 
                      <>
                         Swap
                      </> :  
                      <>
                        <CircularProgress size={20} sx={{ mr: 1}} />  &nbsp;Routing
                      </>
                    }
                </Button>
              </Box>
          </Box>
        </Grid>
        <Grid item xs>
          <Box sx={{
            pt: { xs: 1, sm: 2 },
            pb: { xs: 1, sm: 2 },
            margin: { xs: .1, sm: .2},
          }}>
            <Typography variant="h4" sx={boxHeadingStyle}>
                  Route
            </Typography>

            <SwapsVisualizer swap={selectedRoute} />
          </Box>
        </Grid>
      </Grid>
        
        <SwapExecutor 
          from={fromDetails} 
          to={toDetails} 
          setSwapRoutes={setSwapRoutes} 
          setIsBuildingRoutes={setIsBuildingRoutes}  />
      </>
  )
}