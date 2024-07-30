import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import PropTypes from 'prop-types';


function NetworkSelector({network, onNetworkChanged}){
    return (
        <Box sx={{
            textAlign: 'center',
            mb: 4,
            '& .MuiToggleButton-root': {
                '&:not(.Mui-selected):hover': {
                    backgroundColor: 'unset', // Change this to your desired hover color
                    color: 'white',
                },
                },
        }} >
            <ToggleButtonGroup
                color="primary"
                value={network}
                exclusive
                onChange={ (event, value) => { onNetworkChanged(value)}}
                aria-label="Platform"
            >
                <ToggleButton value="mainnet">Mainnet</ToggleButton>
                <ToggleButton value="testnet">Testnet</ToggleButton>
            </ToggleButtonGroup>
        </Box>
        
    )
}

NetworkSelector.propTypes = {
    network: PropTypes.string.isRequired,
    onNetworkChanged: PropTypes.func.isRequired,
};

export default NetworkSelector