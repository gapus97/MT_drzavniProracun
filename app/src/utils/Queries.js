

/**
 * Query state outcome
 * @param {String} cityName 
 */
function queryStateOutcome(cityName){ 
    return `${queries.statesOutcome}?q=name:${cityName}`
}


let queries = {
    statesOutcome: `states_outcome/_search`,
    states: "states/_search/?size=220&pretty=true"
    // add more etc...
};


export { queries, queryStateOutcome};