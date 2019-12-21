import { fetchJSON } from '../utils/FetchUtils';
import { apiEndPoints, qMap } from '../utils/Queries';

const getStates = async() => {
    let data = await fetchJSON(`${apiEndPoints.states}`, "GET", {});

    return data;
}

async function fetchAPIData(stateName, queryKey, year) {
    if (!queryKey) {
        return;
    }
    let data = await fetchJSON(`${qMap(stateName, queryKey, year)}`, "GET");
    return data;
}



export  { 
    fetchAPIData,
    getStates
};