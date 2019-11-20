import { fetchJSON, apiUrl } from '../utils/FetchUtils';
import { queries,queryStateOutcome, queryMap } from '../utils/Queries';

async function states() {
    let data = await fetchJSON(`${apiUrl}${queries.states}`, "GET", {});
    let statesData = [];

    console.log(data);

    if (data !== undefined && data.hits !== null && data.hits.hits !== null) {
        data.hits.hits.forEach(element => {
            let state = element._source;
            statesData.push(state);
        });
    }

    return statesData;
};

async function stateOutcomeToMoney(stateName) {
    let data = await fetchJSON(`${apiUrl}${queryStateOutcome(stateName)}`, "GET");
    let state;

    if (data !== undefined && data.hits !== null && data.hits.hits !== null) {
        state = data.hits.hits[0]._source;
    }

    return state;
}

async function fetchData(stateName, queryKey, year) {
    
    let data = await fetchJSON(`${apiUrl}${queryMap(stateName, queryKey, year)}`, "GET");
    let responseData;

    if (data !== undefined && data.hits !== null && data.hits.hits !== null) {
        responseData = data.hits.hits[0]._source;
    }

    return responseData;
}


export  { states, stateOutcomeToMoney, fetchData };