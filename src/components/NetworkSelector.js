import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";


export default function NetworkSelector(){

    const [ selectedNework, setSelectedNetwork ] = useState("mainnet")

    

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
                value={selectedNework}
                exclusive
                onChange={ (event, value) => { setSelectedNetwork(value)}}
                aria-label="Platform"
            >
                <ToggleButton value="mainnet">Mainnet</ToggleButton>
                <ToggleButton value="testnet">Testnet</ToggleButton>
            </ToggleButtonGroup>
        </Box>
        
    )
}