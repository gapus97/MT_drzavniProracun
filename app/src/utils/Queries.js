
/**
 * Get only outcome MAIN categories
 * @param {*} cityName 
 */
function queryCityBasicOutcome(cityName) {
    
    return `${queries.statesOutcome}?q=state_name:*${cityName} sub_cat.keyword:""`
}

function queryStateOutcome(cityName){ 
    return `${queries.statesOutcome}?q=state_name=${cityName}`
}


let queries = {
    statesOutcome: `states_outcome/_search`,
    states: "states/_search/?size=220&pretty=true"
    // add more etc...
};


export { queries, queryCityBasicOutcome, queryStateOutcome};