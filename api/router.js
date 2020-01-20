'use strict';
const { Client } = require('@elastic/elasticsearch');
const express = require('express');
const router = new express.Router();
let client = null;

if (process.env.apiUrl) {
    client = new Client({ node: process.env.apiUrl });
} else {
    client = new Client({ node: 'http://localhost:9200' });
}

const moneyRounder = (moneyData) => {
    return parseFloat(Number.parseFloat(moneyData).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
};



const categories = [
    "states_outcome",
    /*'loans_and_capital',*/
    /*'debt_payment',*/
    'investment_transfers',
    'investment_outgoings',
    'current_transfers'
];

const allCategories = [
    "states_outcome",
    'loans_and_capital',
    'debt_payment',
    'investment_transfers',
    'investment_outgoings',
    'current_transfers'
];

const youngFamilySearch = [
    "socialna varnost",
    "javni red in varnost",
    "izobraževanje",
    "zdravstvo"
];


const supportedYears = [2016, 2017, 2018];

const parseAverageForFamilySearch = async () =>{
    try {
        const result = await client.search({
            index: "states",
            filterPath: ['hits.hits._source'],
            "from" : 0, "size" : 212,
            body: {
                "query": {
                    "match_all": {}
                },
            }
        });
    let exportedData = { "socialna varnost":0,
    "javni red in varnost":0,
    "izobraževanje":0,
    "zdravstvo":0};
    const data = getData(result);
   // console.log(JSON.stringify(data.length));
    for (var ii = 0; ii < data.length; ii++) {
        const categoriesForState = await getYoungCategoriesByState(data[ii]["name"]);
        for (var i = 0; i < youngFamilySearch.length; i++) {
            let categorie = youngFamilySearch[i];
            let mainCategories = categoriesForState[categorie];
            try{
            exportedData[categorie] += mainCategories["value"]; 
            }
            catch{
                exportedData[categorie] += 0;  
            } 
        }
    }
    for (var i = 0; i < youngFamilySearch.length; i++) {
        exportedData[youngFamilySearch[i]] = exportedData[youngFamilySearch[i]]/data.length;
    }
    console.log(JSON.stringify(exportedData));
    return exportedData;
}
 catch (error) {
    console.log(error);
}
}

const parseAllCategories = async (stateName) => {
    let overallBudgetData = [{
        2018: [],
        2017: [],
        2016: []
    }];

    try {
        for (let i = 0; i < allCategories.length; i++) {
            let catName = allCategories[i];
            const result = await client.search({
                index: catName,
                filterPath: ['hits.hits._source'],
                body: {
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "match_phrase": {
                                        "name": stateName,
                                    }
                                }
                            ],
                            "minimum_should_match": 1
                        }
                    },
                    "size": 30
                }
            });


            if (Object.keys(result.body).length !== 0) {
                let data = getData(result);

                for (let item of data) {
                    overallBudgetData[0][item.year].push({
                        "categorie": catName,
                        "data": item
                    });               
                }
            } else {

            }
        }

        return overallBudgetData;

    } catch (error) {
        return error;
    }
}

const parseFamilyCategories = (data) => {
    let exportedData = {};
    let maxData = { "value": 0 };
    let minData = { "value": Number.POSITIVE_INFINITY };

    for (let i = 0; i < youngFamilySearch.length; i++) {
        let categorie = youngFamilySearch[i];
        exportedData[categorie] = { "value": 0, "min": minData, "max": maxData};

        for (let ii = 0; ii < data.length; ii++) {
            for (var j = 0; j < data[ii].children.length; j++) {
                let mainCategories = data[ii].children[j];
                let main = {
                    "name": mainCategories.name,
                    "value": mainCategories.value
                };

                if (mainCategories.name.toLowerCase().includes(categorie)) {
                    let convertedNumber = parseFloat(main.value.toFixed(2));
                    exportedData[categorie].value += convertedNumber;
                    //exportedData[0].push(main);      

                    let subCategories = mainCategories.children;
                    for (var l = 0; l < subCategories.length; l++) {
                        let subCategorie = subCategories[l];

                        let sub = {
                            "name": subCategorie.name,
                            "value": subCategorie.value
                        };
                        

                        // max per categorie
                        if (sub.value > maxData.value) {
                            maxData = sub;
                            exportedData[categorie].max = maxData;
                        }

                        // parse min value
                        if (sub.value < minData.value) {
                            minData = sub;
                            exportedData[categorie].min = minData;
                        }

                        let subSubCategories = subCategorie.children;



                        for (var k = 0; k < subSubCategories.length; k++) {
                            let subSubCategorie = subSubCategories[k];

                            let subSub = {
                                "name": subSubCategorie.name,
                                "value": subSubCategorie.value
                            };

                            // max per categorie
                            if (subSub.value > maxData.value) {
                                maxData = subSub;
                                exportedData[categorie].max = maxData;
                            }

                            // parse min value
                            if (subSub.value < minData.value) {
                                minData = subSub;
                                exportedData[categorie].min = minData;
                            }

                        }
                    }
                }
            }
        }
        maxData = {"value": 0};
        minData = {"value": Number.POSITIVE_INFINITY};
    }

    return exportedData;
};

const getNearestStates = async (lat, lon) => {
    try {
        let data = [];
        let range = 0.14; // 1 => 111km ?? not sure, soo about ~ 17km
        /* 
            lat-range to lat || lon - range to lon && lat to lat+range || lon && lon to lon+range
            compley as fck
        */
        const result = await client.search({
            index: "states",
            filterPath: ['hits.hits._source'],
            body: {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "bool": {
                                    "should": [
                                        {
                                            "range": {
                                                "lat": {
                                                    "gte": lat - range,
                                                    "lt": lat
                                                }
                                            },
                                        }, {
                                            "range": {
                                                "lon": {
                                                    "gte": lon - range,
                                                    "lt": lon
                                                }
                                            }
                                        }
                                    ]
                                }
                            }, {
                                "bool": {
                                    "should": [
                                        {
                                            "range": {
                                                "lat": {
                                                    "gte": lat,
                                                    "lt": lat + range
                                                }
                                            },
                                        }, {
                                            "range": {
                                                "lon": {
                                                    "gte": lon,
                                                    "lt": lon + range
                                                }
                                            }
                                        }
                                    ]
                                }

                            }


                        ]
                    }
                }

            }
        });

        if (Object.keys(result.body).length !== 0) {
            data = getData(result);
            return data;
        } else {
            return data;
        }
    } catch (error) {
        return error;
    }
};

const getKinderGardensByState = async (name) => {
    try {
        let data = [];
        const result = await client.search({
            index: "kindergartensbystate",
            filterPath: ['hits.hits._source'],
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "kindergarten_state": name,
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                },
                "size": 30
            }
        });

        if (Object.keys(result.body).length !== 0) {
            data = getData(result);
            return data;
        } else {
            return data;
        }
    } catch (error) {
        return error;
    }
};


const getYoungCategoriesByState = async (name) => {
    try {
        let data;

        const result = await client.search({
            index: categories,
            filterPath: ['hits.hits._source'],
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "name": name,
                                }
                            }
                        ],

                        "filter": {
                            "term": {
                                "year": 2018
                            }
                        },
                        "minimum_should_match": 1
                    }
                }
            },
            "size": 30
        });

        let exportedData = [];
        if (Object.keys(result.body).length !== 0) {
            data = getData(result);
            exportedData = parseFamilyCategories(data);
            let sortedList = {};
            Object.keys(exportedData).sort((a, b) => exportedData[b].value - exportedData[a].value).forEach((key) => {
                sortedList[key] = exportedData[key];
            });
            return sortedList;
        } else {
            return exportedData;
        }

    } catch (error) {
        return error;
    }
};

const getState = async (name) => {
    try {
        let state;
        const result = await client.search({
            index: 'states',
            filterPath: ['hits.hits._source'],
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "name": name
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
        });



        if (Object.keys(result.body).length !== 0) {
            const resultData = getData(result);

            return resultData[0];
        } else {
            return [];
        }

    } catch (error) {
        return error;
    }
}

const calculateIndex = (familyData, populationData) => {
    let indexData = {};
    for (var key of Object.keys(familyData)) {
        let result = moneyRounder(familyData[key].value / populationData);
        indexData[key] = result;
    }

    return indexData;
};

const normalisedIndex = (indexByCategories) => {
    let normalised = 0;
    for (var key of Object.keys(indexByCategories)) {
        normalised += indexByCategories[key];
    }

    return normalised / 4;
};

const getData = (data) => {
    let exportedData = [];

    data = data.body.hits.hits;

    for (let i = 0; i < data.length; i++) {
        let instance = data[i]._source;
        exportedData.push(instance);
    }
    return exportedData;
};

const parseSpecificYear = (data) => {
    let specificYear = [{
        2018: [],
        2017: [],
        2016: []
    }];

    for (let i = 0; i < data.length; i++) {
        let row = data[i];

        specificYear[0][row.year].push(row);
    }

    return specificYear;
};


router.get('/api/health', (req, res) => {
    res.send('API is working!')
});

router.get("/api/statesOutcome/name=:name", async (req, res) => {
    let name = req.params.name;


    try {
        const result = await client.search({
            index: 'states_outcome',
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "name": name
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
        });

        let data = [];

        if (Object.keys(result.body).length !== 0) {
            data = getData(result);
            data = parseSpecificYear(data);
        }
        res.send(data);

    } catch (error) {
        res.send({ error: "can't get any data from DB" })
    }

});


router.get("/api/loansAndCapital/name=:name", async (req, res) => {
    let name = req.params.name;


    try {
        const result = await client.search({
            index: 'loans_and_capital',
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "name": name
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
        });

        let data = [];

        if (Object.keys(result.body).length !== 0) {
            data = getData(result);
            data = parseSpecificYear(data);
        }
        res.send(data);

    } catch (error) {
        res.send({ error: error });
    }

});

router.get("/api/investmentTransfers/name=:name", async (req, res) => {
    let name = req.params.name;


    try {
        const result = await client.search({
            index: 'investment_transfers',
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "name": name
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
        });

        let data = [];

        if (Object.keys(result.body).length !== 0) {
            data = getData(result);
            data = parseSpecificYear(data);
        }
        res.send(data);

    } catch (error) {
        res.send({ error: error });
    }

});


router.get("/api/investmentOutgoings/name=:name", async (req, res) => {
    let name = req.params.name;


    try {
        const result = await client.search({
            index: 'investment_outgoings',
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "name": name
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
        });

        let data = [];

        if (Object.keys(result.body).length !== 0) {
            data = getData(result);
            data = parseSpecificYear(data);
        }
        res.send(data);

    } catch (error) {
        res.send({ error: error });
    }

});

router.get("/api/debtPayment/name=:name", async (req, res) => {
    let name = req.params.name;


    try {
        const result = await client.search({
            index: 'debt_payment',
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "name": name
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
        });

        let data = [];

        if (Object.keys(result.body).length !== 0) {
            data = getData(result);
            data = parseSpecificYear(data);
        }
        res.send(data);

    } catch (error) {
        res.send({ error: error });
    }

});

router.get("/api/currentTransfers/name=:name", async (req, res) => {
    let name = req.params.name;


    try {
        const result = await client.search({
            index: 'current_transfers',
            filterPath: ['hits.hits._source'],
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "name": name
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
        });

        let data = [];

        if (Object.keys(result.body).length !== 0) {
            data = getData(result);
            data = parseSpecificYear(data);
        }
        res.send(data);

    } catch (error) {
        res.send({ error: error });
    }

});

router.get("/api/states", async (req, res) => {
    try {
        const result = await client.search({
            index: 'states',
            filterPath: ['hits.hits._source'],
            body: {
                "query": {
                    "match_all": {}
                },
                'size': 300
            },

        });

        const statesData = getData(result);

        if (statesData) {
            res.send(statesData);
        } else {
            res.send([]);
        }

    } catch (error) {
        res.send({ error: error.message });
    }

});

router.get("/api/getAllCategories/name=:name", async (req, res) => {
    const stateName = req.params.name;
    try {
        const result = await parseAllCategories(stateName);

        res.send(result);
    } catch (error) {
        res.send({ error: error.message });
    }
});

router.get("/api/overallBudgetData", async (req, res) => {
    let overallBudgetData = {
        2018: {},
        2017: {},
        2016: {}
    };

    try {
        const result = await client.search({
            index: allCategories,
            filterPath: ['hits.hits'],
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "name": 'SKUPAJ*',
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                },
                "size": 30
            }
        });

        const data = result.body.hits.hits;

        if (data) {
            data.forEach(row => {
                let indeks = row._index;
                let source = row._source;
                let year = source.year;

                let importantData = {
                    "name": source.name,
                    "value": source.value,
                    "year": source.year
                };
                overallBudgetData[year] = {
                    ...overallBudgetData[year],
                    [`${indeks}`]: importantData 
                };
                //overallBudgetData[0][source.year].push(importantData);
            });
            res.send(overallBudgetData);
        } else {
            res.send([]);
        }
    } catch (error) {
        res.send({ error: error });
    }

});


router.get("/api/kindergardens", async (req, res) => {
    try {
        const result = await client.search({
            index: "kindergartensbystate",
            filterPath: ['hits.hits._source'],
            body: {
                "query": {
                    "match_all": {}
                },
                'size': 300
            }
        });

        const data = getData(result);
        if (data) {
            res.send(data);
        } else {
            res.send([]);
        }
    } catch (error) {
        res.send({ error: `Can't get any kinder garden data: ${error}` });
    }
});

router.get("/api/kindergarden/name=:name", async (req, res) => {
    const stateName = req.params.name;

    try {
        const data = await getKinderGardensByState(stateName);

        if (data) {
            res.send(data);
        } else {
            res.end([]);
        }
    } catch (error) {
        res.send({ error: `Can't get any kinder garden in state ${stateName}` });
    }


});

router.get("/api/nearestStates/name=:name", async (req, res) => {
    const stateName = req.params.name;

    try {
        const state = await getState(stateName);


        if (state) {
            const lat = state.lat;
            const lon = state.lon;


            let data = await getNearestStates(lat, lon);

            if (data) {
                res.send(data);
            } else {
                res.send([]);
            }
        }

    } catch (error) {
        res.send({ error: `Cant get nearest states for state name ${stateName}` });
    }

});

router.get("/api/youngFamilies/name=:name", async (req, res) => {
    const stateName = req.params.name;

    try {
        const avg = await parseAverageForFamilySearch();
        const youngFamilyData = [];
        const searchState = await getState(stateName);
        const stateYoungFamilyData = await getYoungCategoriesByState(stateName);
        const stateKindergardnes = await getKinderGardensByState(stateName);
        let nearestStates;
        if (searchState) {
            nearestStates = await getNearestStates(searchState.lat, searchState.lon);
        }

        if (nearestStates && stateYoungFamilyData) {
            youngFamilyData.push({
                "name": stateName,
                "population": searchState.population,
                "values": [stateYoungFamilyData, stateKindergardnes],
                "index": calculateIndex(stateYoungFamilyData, searchState.population),
                "avg":avg,
                "normalisedIndex": normalisedIndex(calculateIndex(stateYoungFamilyData, searchState.population))
            });
            for (let i = 0; i < nearestStates.length; i++) {
                let state = nearestStates[i].name;
                let stateYoungData = await getYoungCategoriesByState(state);
                let kindegardens = await getKinderGardensByState(state);

                let calculatedIndex = calculateIndex(stateYoungData, nearestStates[i].population);


                youngFamilyData.push({
                    "name": state,
                    "population": nearestStates[i].population,
                    "values": [stateYoungData, kindegardens],
                    "index": calculatedIndex,
                    "avg":avg,
                    "normalisedIndex": moneyRounder(normalisedIndex(calculatedIndex))
                });
            }

            /* sort array by normalised index */
            youngFamilyData.sort((a, b) => (a.normalisedIndex > b.normalisedIndex) ? -1 : 1);

            res.send(youngFamilyData);
        } else {
            res.send([]);
        }
    } catch (error) {
        console.log(error.message);
        res.send({ error: `Cant get young families index for state name ${stateName}` });
    }
});

module.exports = router;
