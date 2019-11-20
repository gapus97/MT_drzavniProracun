

/**
 * Query state outcome
 * @param {String} cityName 
 */
function queryStateOutcome(cityName, year){ 
    return `${queries.statesOutcome}?q=name:${cityName} AND year:${year}`
}

function queryCurrentTransfers(cityName, year) {
    return `${queries.currentTransfers}?q=name:${cityName} AND year:${year}`
}

function queryOutgoingInvestments(cityName, year) {
    return `${queries.outgoingInvestments}?q=name:${cityName} AND year:${year}`
}

function queryInvestmentsTransfers(cityName, year) {
    return `${queries.investmentTransfers}?q=name:${cityName} AND year:${year}`
}

function queryLoansAndCapital(cityName, year) {
    return `${queries.loansAndCapital}?q=name:${cityName} AND year:${year}`
}

function queryDeptPayments(cityName, year) {
    return `${queries.deptPayments}?q=name:${cityName} AND year:${year}`
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


let supportedYears = {
    2018: '2018',
    2017: '2017',
    2016: '2016'
};

function queryMap(cityName, queryKey, year) {
    switch(queryKey) {
        case 'statesOutcome':
            return queryStateOutcome(cityName, year);
        case 'currentTransfers':
            return queryCurrentTransfers(cityName, year);
        case 'investmentTransfers':
            return queryInvestmentsTransfers(cityName, year);
        case 'outgoingInvestments':
            return queryOutgoingInvestments(cityName, year);
        case 'loansAndCapital':
            return queryLoansAndCapital(cityName, year);
        case 'deptPayments':
            return queryDeptPayments(cityName, year);
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
    queryMap,
    supportedYears
};