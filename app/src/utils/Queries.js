

/**
 * Query state outcome
 * @param {String} cityName 
 */
function queryStateOutcome(cityName){ 
    return `${queries.statesOutcome}?q=name:${cityName}`
}

function queryCurrentTransfers(cityName) {
    return `${queries.currentTransfers}?q=name:${cityName}`
}

function queryOutgoingInvestments(cityName) {
    return `${queries.outgoingInvestments}?q=name:${cityName}`
}

function queryInvestmentsTransfers(cityName) {
    return `${queries.investmentTransfers}?q=name:${cityName}`
}

function queryLoansAndCapital(cityName) {
    return `${queries.loansAndCapital}?q=name:${cityName}`
}

function queryDeptPayments(cityName) {
    return `${queries.deptPayments}?q=name:${cityName}`
}


let queries = {
    statesOutcome: `states_outcome/_search`,
    states: "states/_search/?size=220&pretty=true",
    currentTransfers: "current_transfers/_search",
    outgoingInvestments: "investment_outgoings/_search",
    investmentTransfers: "investment_transfers/_search",
    loansAndCapital: "loans_and_capital/_search",
    deptPayments: "debt_payment/_search"
    // add more etc...
};

function queryMap(cityName, queryKey) {
    switch(queryKey) {
        case 'statesOutcome':
            return queryStateOutcome(cityName);
        case 'currentTransfers':
            return queryCurrentTransfers(cityName);
        case 'investmentTransfers':
            return queryInvestmentsTransfers(cityName);
        case 'outgoingInvestments':
            return queryOutgoingInvestments(cityName);
        case 'loansAndCapital':
            return queryLoansAndCapital(cityName);
        case 'deptPayments':
            return queryDeptPayments(cityName);
    }
}

let budgetCategories = {
    statesOutcome: "Tekoči odhodki",
    currentTransfers: "Tekoči transferi",
    outgoingInvestments: "Investicijski odhodki",
    investmentTransfers: "Investicijski transferi",
    loansAndCapital: "Dana posojila in povečanje kapitalskih deležev",
    deptPayments: "Odplačilo dolga"
};

export { 
    queries, 
    budgetCategories,
    queryStateOutcome, 
    queryCurrentTransfers,
    queryInvestmentsTransfers,
    queryOutgoingInvestments,
    queryLoansAndCapital,
    queryDeptPayments,
    queryMap
};