import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Container } from '@mui/material';
import SwapVisualizerNetworkInteraction from './SwapVisualizerNetworkInteraction';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

function makeUIModelFromSwap(swap){
    if(!swap) { return [] }

    const chainlist = {} 
    const model = [];
    const lastSwap = swap.route[swap.route.length-1];

    const addToChainlist = (chainId, step, token) => {
        if(!chainlist[chainId]) {
            chainlist[chainId] = {addedToModel: false, icon: token.networkIcon, items: []}
        }

        chainlist[chainId].items.push(step);
    }

    const addToModel = (chainId) => {
        const chainInterations = chainlist[chainId];

        if(!chainInterations.addedToModel){
            const first = chainInterations.items[0];
            const last = chainInterations.items[chainInterations.items.length-1];

            model.push({...chainInterations, amountIn: first.quote.amountIn, amountOut: last.quote.amountOut, tokenIn: first.from, tokenOut: last.to });

            chainlist[chainId].addedToModel = true
        }
    }

    swap.route.forEach((step) => { addToChainlist(step.from.chainId, step, step.from); })

    if(!chainlist[lastSwap.to.chainId])
        addToChainlist(lastSwap.to.chainId, lastSwap, lastSwap.to);

    swap.route.forEach(step => {
        addToModel(step.from.chainId);
    })

    return model;
}

function SwapsVisualizer({ swap }) {
    const model = makeUIModelFromSwap(swap)
    const destinationAsset = model.length > 0 ? swap.route[swap.route.length-1].to : null;
    const lastSwappedNetwork = model.length > 0 ? model[model.length-1] : null;

  return (
    <Container>
        { model.length ===0 ? <></> :
            <Timeline position="right">
                {model.map((network) => (
                    <>

                    <TimelineItem>
                        <TimelineOppositeContent color="textSecondary" sx={{ maxWidth: "0", flex: 1, mt: "13px" }} />
                        <TimelineSeparator>
                        <TimelineDot sx={{backgroundColor: "#fff"}}>
                            <Avatar src={network.icon} sx={{ height: "22px", width: "22px"}}></Avatar>
                        </TimelineDot>
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <SwapVisualizerNetworkInteraction network={network} displaySwapOutputs={false} /> 
                        </TimelineContent>
                    </TimelineItem>
                    </>
                ))}

                { !destinationAsset ? null :
                    <TimelineItem>
                        <TimelineOppositeContent color="textSecondary" sx={{ maxWidth: "0", flex: 1, mt: "13px" }} />
                        <TimelineSeparator>
                            <TimelineDot sx={{backgroundColor: "#fff"}}>
                                <Avatar src={destinationAsset.networkIcon} sx={{ height: "22px", width: "22px"}}></Avatar>
                            </TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent>
                            <SwapVisualizerNetworkInteraction network={lastSwappedNetwork} displaySwapOutputs={true} /> 
                        </TimelineContent>
                    </TimelineItem>
                }
            </Timeline>
        }
    </Container>
  );
}

SwapsVisualizer.propTypes = {
    swap: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SwapsVisualizer
