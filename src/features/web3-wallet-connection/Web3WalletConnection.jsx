import PropTypes from 'prop-types';

import { ConnectWallet } from '@thirdweb-dev/react';
import { Container } from '@mui/system';

function Web3WalletConnection({active}){
    return (
        <Container>
            { active ? <ConnectWallet theme="dark" style={{
                outline: 0,
                border: 0,
                margin: 0,
                borderRadius: 0,
                padding: 0,
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 100ms ease",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "0.8125rem",
                lineHeight: 1.75,
                textTransform: "capitalize",
                padding: "4px 10px",
                borderRadius: "12px",
                color: "hsl(210, 100%, 97%)",
                backgroundColor: "hsl(210, 98%, 48%)",
                backgroundImage: "linear-gradient(to bottom, hsla(210, 98%, 48%, 0.8), hsl(210, 98%, 42%))",
            }} /> : null }
        </Container>
    )
};

Web3WalletConnection.propTypes = {
    active: PropTypes.bool.isRequired
};

export default Web3WalletConnection;