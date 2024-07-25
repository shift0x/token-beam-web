import PropTypes from 'prop-types';
import { useEffect } from "react";
import { getQuotes } from './api/router/router';



function SwapExecutor({from, to}){
    useEffect(() => {
        const isValidFrom = from.token != null && from.network != null && from.amount > 0;
        const isValidTo = to.token != null && to.network != null;
    
        if(!isValidFrom || !isValidTo) { return; }

        getQuotes(from, to);
    
      }, [from, to])

}

SwapExecutor.propTypes = {
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired
};

export default SwapExecutor