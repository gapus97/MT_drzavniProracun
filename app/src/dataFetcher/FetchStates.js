import { fetchJSON } from '../utils/FetchUtils';

async function states() {
    let data = await fetchJSON("http://localhost:9200/states/_search", "GET");
    let statesData = [];

    console.log(data);

    data.hits.hits.forEach(element => {
        let state = element._source;
        statesData.push(state);
    });

    return statesData;
};

export  { states };