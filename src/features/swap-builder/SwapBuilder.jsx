import { Avatar, AvatarGroup, Box, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SwapWaypoint from "./SwapWaypoint";
import { getNetworks } from "./api/network/networks";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SwapExecutor from "./SwapExecutor";
import SwapsVisualizer from "../../components/SwapVisualizer";
import { getExecutionOperations } from "./api/router/router";
import { useAddress, useChainId, useSwitchChain, useConnect, metamaskWallet, useSigner } from "@thirdweb-dev/react";
import PropTypes from 'prop-types';

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
  fontWeight: "bold",
}

const boxHeadingTextStyle = {
  color: "#ccc",
  fontSize: "1rem"
}

const tokenAvatarStyle = {
  backgroundColor: "#fff",
  padding: "1px",
  height: "20px",
  width: "20px"
}

function createModel(route) {
  const model = {
    amountIn: route.amountIn,
    amountOut: route.amountOut,
    route: route,
    tokens: []
  }

  route.route.forEach((swap, index) => {
    if(index == 0){ model.tokens.push(swap.from) }

    model.tokens.push(swap.to);
  })

  return model;
}



function SwapBuilder({network}){
  const [ fromDetails, updateFromDetails] = useState({amount:0, token: null, network: null });
  const [ toDetails, updateToDetails] = useState({amount:0, token: null, network: null });
  const [ allSwapRoutes, setSwapRoutes] = useState([]);
  const [ selectedRoute, setSelectedRoute] = useState(null);
  const [ isBuildingRoutes, setIsBuildingRoutes] = useState(false);
  const [ quoteErrorMessage, setQuoteErrorMessage] = useState(null);
  const [ model, setModel] = useState([])

  const connectedAddress = useAddress();
  const connectedChainId = useChainId();
  const switchChain = useSwitchChain();
  const connectWallet = useConnect();
  const signer = useSigner();

  const metamaskConfig = metamaskWallet();

  
  const networks = getNetworks(network);

  useEffect(() => {
    setTimeout(() => {
      setIsBuildingRoutes(false);

      const optimalRoute = allSwapRoutes[0];
      const errorMessage = !optimalRoute ? "no routes found between assets" : optimalRoute.amountOut == 0 ? "input amount is too small or too large" : null;


      setSelectedRoute(optimalRoute);
      setQuoteErrorMessage(errorMessage);
      setModel(allSwapRoutes.map(route => { return createModel(route)}));
    }, 1000)  
  }, [allSwapRoutes]);

  async function ensureUserIsConnectedToCorrectChain(chainId){
    await connectWallet(metamaskConfig);
    await switchChain(chainId);
  }

  async function swap(){
    const trade = selectedRoute;
    const chainId = Number(trade.route[0].from.chainId)

    await ensureUserIsConnectedToCorrectChain(chainId);

    console.log({connectedAddress, connectedChainId, trade})

    trade.operation = await getExecutionOperations(selectedRoute.route, connectedAddress, network);

    for(var i =0; i < trade.operation.length; i++){
      const prev = i == 0 ? null : trade.operation[i-1];
      const next = i == trade.operation.length-1 ? null : trade.operation[i+1];
      const op = trade.operation[i];

      await op.execute(signer, prev, next);
    }
  }
  

  return (
    <>
      <Grid container spacing={2}>
        <Grid item style={{width: "400px", minHeight: "500px"}}>
          <Box 
              sx={boxContentsStyle}
              style={{minHeight:"483px"}} >
              <Typography variant="h4" sx={boxHeadingStyle}>
                <span style={boxHeadingTextStyle}> Swap </span>
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
                }} onClick={ swap }>
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
                  <span style={boxHeadingTextStyle}>Route</span>
            </Typography>

            <Box display="flex" flexDirection="column" alignItems="center" sx={{margin: 3, marginLeft: 1}}>
              <Grid container spacing={2} justifyContent="center">
                { model.map(route => (
                  <Box alignItems="center" justifyContent="center" sx={{
                    display: "flex",
                    marginLeft: 2,
                    cursor: "pointer",
                    backgroundColor: selectedRoute.id == route.route.id ? "hsla(210, 98%, 55%, 0.3)" : "unset",
                    padding: "5px 15px",
                    color: selectedRoute.id == route.route.id ? "#fff" : "unset"
                  }} onClick={ () => { setSelectedRoute(route.route) }}>
                        <AvatarGroup>
                            { route.tokens.map(token => (
                                <Avatar src={token.icon} sx={tokenAvatarStyle} />
                            ))}
                        </AvatarGroup>

                        <Typography variant="body1" sx={{ marginLeft: "5px"}}>
                            {
                                route.amountOut > 1 ? 
                                  route.amountOut.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) :
                                  route.amountOut.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6})
                            }
                        </Typography>
                  </Box>
                ))}
              </Grid>
            </Box>

            <SwapsVisualizer swap={selectedRoute} />
          </Box>
        </Grid>
      </Grid>
        
        <SwapExecutor 
          from={fromDetails} 
          to={toDetails} 
          network={network}
          setSwapRoutes={setSwapRoutes} 
          setIsBuildingRoutes={setIsBuildingRoutes}  />
      </>
  )
}

SwapBuilder.propTypes = {
  network: PropTypes.string.isRequired,
};

export default SwapBuilder