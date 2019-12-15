'use strict';
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
const express = require('express');
const router = new express.Router();




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

const parseAllCategories = async (stateName) => {
    let overallBudgetData = [{
        2018: [],
        2017: [],
        2016: []
    }];

    try {
        for(let i = 0; i < allCategories.length; i++) {
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


            if(Object.keys(result.body).length !== 0) {
                let data = getData(result);

                for(let item of data) {
                    overallBudgetData[0][item.year].push({
                        "categorie": catName,
                        "data": item
                    });
                    console.log(overallBudgetData);
                    
                }
            } else {
                
            }
        }

        return overallBudgetData;
       
    } catch(error) {
        return error;
    }
}

const parseFamilyCategories = (data) => {
    let exportedData = {};
    
    for (let i = 0; i < youngFamilySearch.length; i++) {
        let categorie = youngFamilySearch[i];
        exportedData[categorie] = 0;

        for(let ii = 0; ii < data.length; ii++) {
            for (var j = 0; j < data[ii].children.length; j++) {
                let mainCategories = data[ii].children[j];
                let main = {
                    "name": mainCategories.name,
                    "value": mainCategories.value
                };
                if (mainCategories.name.toLowerCase().includes(categorie)) {
                    exportedData[categorie] += main.value;
                    //exportedData[0].push(main);
                    
                }
                 
                let subCategories = mainCategories.children;
                for (var l = 0; l < subCategories.length; l++) {
                    let subCategorie = subCategories[l];

                    let sub = {
                        "name": subCategorie.name,
                        "value": subCategorie.value
                    };
                    //console.log(sub);

                    if (subCategorie.name.includes(categorie)) {
                        exportedData[categorie] += sub.value;
                    }

                    let subSubCategories = subCategorie.children;



                    for (var k = 0; k < subSubCategories.length; k++) {
                        let subSubCategorie = subSubCategories[k];

                        let subSub = {
                            "name": subSubCategorie.name,
                            "value": subSubCategorie.value
                        };

                        if (subSubCategorie.name.includes(categorie)) {
                            exportedData[categorie] += subSub.value;
                        }
                    }
                }
            }
        }
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

        if(Object.keys(result.body).length !== 0) {
            data = getData(result);
            return data;
        } else {
            return data;
        }
    } catch(error) {  
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
        
        if(Object.keys(result.body).length !== 0) {
            data = getData(result);
            return data;
        } else {
            return data;
        }
    } catch(error) {
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
            return exportedData;
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



        if(Object.keys(result.body).length !== 0) {
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
    for(var key of Object.keys(familyData)) {
        console.log(key);
        let result = familyData[key] / populationData;
        indexData[key] = result;
    }

    return indexData;
};

const normalisedIndex = (indexByCategories) => {
    let normalised = 0;
    for(var key of Object.keys(indexByCategories)) {
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

    for(let i = 0; i < data.length; i++) {
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

        if(Object.keys(result.body).length !== 0) {
            data = getData(result);
            data = parseSpecificYear(data);
        }
        res.send(data);

    } catch (error) {
        console.log("Error: ", error);
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

        if(Object.keys(result.body).length !== 0) {
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

        if(Object.keys(result.body).length !== 0) {
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

        if(Object.keys(result.body).length !== 0) {
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

        if(Object.keys(result.body).length !== 0) {
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

        if(Object.keys(result.body).length !== 0) {
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
    } catch(error) {
        res.send({error: error.message});
    }
});

router.get("/api/overallBudgetData", async (req, res) => {
    let overallBudgetData = [{
        2018: [],
        2017: [],
        2016: []
    }];

    try {
        const result = await client.search({
            index: allCategories,
            filterPath: ['hits.hits._source'],
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

                let importantData = {
                    "name": source.name,
                    "value": source.value,
                    "year": source.year,
                    "indeks": indeks
                };
                overallBudgetData[0][source.year].push(importantData);
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
        res.send({ error: `Can't get any kinder garden in state ${stateName}`});
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
        const youngFamilyData = [];
        const searchState = await getState(stateName);
        const stateYoungFamilyData = await getYoungCategoriesByState(stateName);
        let nearestStates;
        if(searchState) {
            console.log(searchState);
            nearestStates = await getNearestStates(searchState.lat, searchState.lon);
        }

        if(nearestStates && stateYoungFamilyData) {
            youngFamilyData.push({
                "name": stateName,
                "values": stateYoungFamilyData
            });
            for(let i = 0; i < nearestStates.length; i++) {
                let state = nearestStates[i].name;
                let stateYoungData = await getYoungCategoriesByState(state);
                let kindegardens = await getKinderGardensByState(state);

                let calculatedIndex = calculateIndex(stateYoungData, nearestStates[i].population);

                youngFamilyData.push({
                    "name": state,
                    "values": [stateYoungData, kindegardens],
                    "index": calculatedIndex,
                    "normalisedIndex": normalisedIndex(calculatedIndex)
                });
            }

            res.send(youngFamilyData);
        } else {
            res.send([]);
        }
    } catch(error) {
        res.send({ error: `Cant get young families index for state name ${stateName}` });
    }
});

module.exports = router;