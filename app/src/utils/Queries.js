
const qStateOutcome = (cityName,year = null) => {
    return `${apiEndPoints.statesOutcome}name=${cityName}`;
}

const qCurrentTransfers = (cityName,year = null) => {
    return `${apiEndPoints.currentTransfers}name=${cityName}`;
}

const qOutgoingInvestments = (cityName,year = null) => {
    return `${apiEndPoints.outgoingInvestments}name=${cityName}`;
}

const qInvestmentsTransfers = (cityName,year = null) => {
    return `${apiEndPoints.investmentTransfers}name=${cityName}`;
}

const qLoansAndCapital = (cityName,year = null) => {
    return `${apiEndPoints.loansAndCapital}name=${cityName}`;
}

const qDebtPayment = (cityName,year = null) => {
    return `${apiEndPoints.deptPayments}name=${cityName}`;
}

const qAllCategories = (cityName,year = null) => {
    return `${apiEndPoints.allCategories}name=${cityName}`;
}

const qFamilyData = (cityName, year = null) => {
    return `${apiEndPoints.familyData}name=${cityName}`;
};



let queries = {
    statesOutcome: `states_outcome/_search`,
    states: "states/_search/?size=220&pretty=true",
    currentTransfers: "current_transfers/_search",
    outgoingInvestments: "investment_outgoings/_search",
    investmentTransfers: "investment_transfers/_search",
    loansAndCapital: "loans_and_capital/_search",
    deptPayments: "debt_payment/_search"
};

let API = 'api/';

let apiEndPoints = {
    statesOutcome: `${API}statesOutcome/`,
    states: `${API}states`,
    currentTransfers: `${API}currentTransfers/`,
    outgoingInvestments: `${API}investmentOutgoings/`,
    investmentTransfers: `${API}investmentTransfers/`,
    loansAndCapital: `${API}loansAndCapital/`,
    deptPayments: `${API}debtPayment/`,
    overallData: `${API}overallBudgetData`,
    allCategories: `${API}getAllCategories/`,
    familyData: `${API}youngFamilies/`
};


let supportedYears = {
    2018: '2018',
    2017: '2017',
    2016: '2016'
};

function qMap(cityName, queryKey, year) {
    switch(queryKey) {
        case 'statesOutcome':
            return qStateOutcome(cityName, year);
        case 'currentTransfers':
            return qCurrentTransfers(cityName, year);
        case 'investmentTransfers':
            return qInvestmentsTransfers(cityName, year);
        case 'outgoingInvestments':
            return qOutgoingInvestments(cityName, year);
        case 'loansAndCapital':
            return qLoansAndCapital(cityName, year);
        case 'deptPayments':
            return qDebtPayment(cityName, year);
        case 'allCategories':
            return qAllCategories(cityName, year);
        case "youngFamily":
            return qFamilyData(cityName, year);
        case "oldFamily":
            return null;
        default:
            return null;
    }
}

let budgetCategories = {
    states_outcome: "Tekoči odhodki",
    current_transfers: "Tekoči transferi",
    investment_outgoings: "Investicijski odhodki",
    investment_transfers: "Investicijski transferi",
    loans_and_capital: "Dana posojila in povečanje kapitalskih deležev",
    debt_payment: "Odplačilo dolga"
};


let categoriesMap = {
    statesOutcome: 'states_outcome',
    currentTransfers: 'current_tranfers',
    outgoingInvestments: 'investment_outgoings',
    investmentTransfers: 'investment_transfers',
    loansAndCapital: 'loans_and_capital',
    deptPayments: 'debt_payment',
};

let supportedFilters = [
    "youngFamily",
    "oldFamily"
];

/* for generating checbox-es */
let supportedFiltersMap = {
    youngFamily: "Mlada družina",
    oldFamily: "Starejši občani",
};


export { 
    queries, 
    budgetCategories,
    supportedYears,
    apiEndPoints,
    qMap,
    categoriesMap,
    supportedFilters,
    supportedFiltersMap
};