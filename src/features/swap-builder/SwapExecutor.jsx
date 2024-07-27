import PropTypes from 'prop-types';
import { useEffect } from "react";
import { getQuotes } from './api/router/router';



function SwapExecutor({from, to, setSwapRoutes, setIsBuildingRoutes}){
    useEffect(() => {

        const handler = async () => {
            const isValidFrom = from.token != null && from.network != null && from.amount > 0;
            const isValidTo = to.token != null && to.network != null;
        
            if(!isValidFrom || !isValidTo) { return; }

            setIsBuildingRoutes(true);

            const quotes = await getQuotes(from, to);

            setSwapRoutes(quotes);
        }

        handler();
        
    
      }, [from, to])

}

SwapExecutor.propTypes = {
    from: PropTypes.object.isRequired,
    to: PropTypes.object.isRequired,
    setSwapRoutes: PropTypes.func.isReqired,
    setIsBuildingRoutes: PropTypes.func.isRequired,
};


export default SwapExecutor