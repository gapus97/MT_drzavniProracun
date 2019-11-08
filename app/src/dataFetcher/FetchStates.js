import { fetchJSON, apiUrl, client } from '../utils/FetchUtils';
import { queries,queryCityBasicOutcome } from '../utils/Queries';

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

async function stateOutcomeMoney(stateName) {
    let data = await fetchJSON(`${apiUrl}${queryCityBasicOutcome(stateName)}`, "GET");
    let stateOutcome = [];



    console.log(data);

    if (data !== undefined && data.hits !== null && data.hits.hits !== null) {
        data.hits.hits.forEach(element => {
            let state = element._source;
            state.state_name = state.state_name.replace("OBČINA", "").replace("MESTNA", "").replace(" ", "");
            stateOutcome.push(state);
        });
    }

    return stateOutcome;
}

export  { states, stateOutcomeMoney };