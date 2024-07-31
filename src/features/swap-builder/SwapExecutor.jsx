import PropTypes from 'prop-types';
import { Dialog, LinearProgress, DialogContent, DialogContentText, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useEffect, useState } from "react";
import { getQuotes } from './api/router/router';
import { getExecutionOperations } from "./api/router/router";
import { useConnect, metamaskWallet } from "@thirdweb-dev/react";
import { useMemo } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { styled } from '@mui/system';

const RotatingGearIcon = styled(SettingsIcon)(({ theme }) => ({
    animation: 'spin 2s linear infinite',
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
  }));

function SwapExecutor({from, to, setSwapRoutes, setIsBuildingRoutes, network, swapToExecute, shouldExecute, onDialogClosed}){
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [tradeOperations, setTradeOperations] = useState([])
    
    const connectWallet = useConnect();
    const metamaskConfig = metamaskWallet();

    async function ensureUserIsConnectedToCorrectChain(chainId){
        try {

            const wallet = await connectWallet(metamaskConfig);

            await wallet.switchChain(chainId);

            return wallet;
        } catch(err){
            console.log(err);

            return null;
        }
    }

    async function swap(){
        const trade = swapToExecute;
        
        let operations = [
            { name: "finalize swap details", complete: false, pending: true }
        ]

        operations = operations.concat(trade.route.map(swap => {
            const name = `swap ${swap.from.symbol} (${swap.from.networkName}) > ${swap.to.symbol} (${swap.to.networkName})`

            return { name : name, complete: false, pending: false}
        }))

        setTradeOperations(operations)

        const updateSwapState = ((index, complete, pending) => {
            setTradeOperations(prev => {
                return prev.map((item, idx) => {
                    if(idx == index){
                        item.complete = complete;
                        item.pending= pending
                    }

                    return item
                })
            });
        });


        
        const chainId = Number(trade.route[0].from.chainId)
        const wallet = await ensureUserIsConnectedToCorrectChain(chainId);

        if(!wallet){
            return;
        }

        const signer = await wallet.getSigner()
        const walletAddress = await wallet.getAddress();

        trade.operation = await getExecutionOperations(swapToExecute.route, walletAddress, network);

        updateSwapState(0, true, false);

        for(var i =0; i < trade.operation.length; i++){
            const prev = i ===0 ? null : trade.operation[i-1];
            const next = i ===trade.operation.length-1 ? null : trade.operation[i+1];
            const op = trade.operation[i];

            try {
                await op.execute(signer, prev, next);

                updateSwapState(i+1, true, false);
            } catch(err){
                alert(err.reason);

                break;
            }
        }
       
    }

    const swapRouteId = useMemo(() => {
        const isValidFrom = from.token !==null && from.network !==null && from.amount > 0;
        const isValidTo = to.token !==null && to.network !==null;
    
        if(!isValidFrom || !isValidTo) { return ""; }

        const id = `${from.amount}::${from.token.id}::${to.token.id}`

        return id
    })


    useEffect(() => { 
        if(swapToExecute && shouldExecute){ 
            setIsDialogOpen(true);
            swap() 
        } else {
            setIsDialogOpen(false);
        }
    }, [shouldExecute])

    useEffect(() => {
        const handler = async () => {
            const isValidFrom = from.token !==null && from.network !==null && from.amount > 0;
            const isValidTo = to.token !==null && to.network !==null;
        
            if(!isValidFrom || !isValidTo) { return; }

            setIsBuildingRoutes(true);

            const quotes = await getQuotes(from, to, network);

            setSwapRoutes(quotes);
        }

        handler();
      }, [swapRouteId])

      return (
        <Dialog onClose={() => { onDialogClosed() }} open={isDialogOpen} sx={{
            
            '& .MuiPaper-root': {
              backgroundColor: '#fff', // White background
              borderRadius: '12px', // Rounded corners
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)', // Drop shadow
            },
          }}>
            <DialogContent sx={{ width: "400px",
                paddingTop: "0px",
                paddingLeft: "0px",
                paddingRight: "0px",
            }}>
                <Box>
                    <LinearProgress sx={{height: 5}} />
                    <DialogContentText sx={{ marginTop: 2 }}>
                        <List>
                            { tradeOperations.map((operation, index) => (
                                <ListItem key={index}>
                                    <ListItemIcon sx={{
                                        minWidth: "unset",
                                        pr: "5px"
                                    }}>
                                        {operation.complete && <CheckCircleIcon style={{ color: 'green', fontSize: "1.25rem" }} />}
                                        {!operation.complete && operation.pending && <RotatingGearIcon style={{ color: 'rgb(2, 122, 242)', fontSize: "1.25rem" }} />}
                                        {!operation.complete && !operation.pending && <HourglassEmptyIcon style={{ color: '#999', fontSize: "1.25rem" }} />}
                                    </ListItemIcon>
                                    <ListItemText primary={operation.name} sx={{
                                        textTransform: "capitalize"
                                    }} />
                                </ListItem>
                                ))
                            }
                        </List>
                    </DialogContentText>
                </Box>
            </DialogContent>
        </Dialog>
      )
}

SwapExecutor.propTypes = {
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired,
    setSwapRoutes: PropTypes.func.isRequired,
    network: PropTypes.string.isRequired,
    onDialogClosed: PropTypes.func.isRequired,
    swapToExecute: PropTypes.object.isRequired,
    shouldExecute: PropTypes.bool.isRequired
};


export default SwapExecutor