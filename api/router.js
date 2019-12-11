'use strict';
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
const express = require('express');
const router = new express.Router();


const categories = [
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

const parseFamilyCategories = (data) => {
    let exportedData = [];
    
    for (let i = 0; i < youngFamilySearch.length; i++) {
        let categorie = youngFamilySearch[i];

        for(let ii = 0; ii < data.length; ii++) {
            for (var j = 0; j < data[ii].children.length; j++) {
                let mainCategories = data[ii].children[j];
                let main = {
                    "name": mainCategories.name,
                    "value": mainCategories.value
                };
                if (mainCategories.name.toLowerCase().includes(categorie)) {
                    exportedData.push(main);
                    
                }
                //console.log(mainCategories.name);
                

               
                let subCategories = mainCategories.children;
                for (var l = 0; l < subCategories.length; l++) {
                    let subCategorie = subCategories[l];

                    let sub = {
                        "name": subCategorie.name,
                        "value": subCategorie.value
                    };
                    console.log(sub);

                    if (subCategorie.name.includes(categorie)) {
                        exportedData.push(sub);
                        break;
                    }

                    let subSubCategories = subCategorie.children;



                    for (var k = 0; k < subSubCategories.length; k++) {
                        let subSubCategorie = subSubCategories[k];

                        let subSub = {
                            "name": subSubCategorie.name,
                            "value": subSubCategorie.value
                        };

                        if (subSubCategorie.name.includes(categorie)) {
                            exportedData.push(subSub);
                            break;
                        }
                    }
                }
            }
        }
    }

    return exportedData;
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

        data = getData(result);

        if (data) {
            //return data;
            let exportedData = parseFamilyCategories(data);
            console.log("Exported data: ", exportedData);
            return exportedData;
            // parse different categories
        } else {
            return null;
        }

    } catch (error) {
        console.log(error.message);
        return null;
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

        const resultData = result.body.hits.hits;

        if (resultData) {
            state = resultData[0]._source;

            return state;
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }
}

const getData = (data) => {
    let exportedData = [];

    data = data.body.hits.hits;

    for (let i = 0; i < data.length; i++) {
        let instance = data[i]._source;
        exportedData.push(instance);
    }
    return exportedData;
}

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

        let data = getData(result);

        if (data) {
            res.send(data);
        } else {
            res.send({ error: "can't get any data from DB" })
        }

    } catch (error) {
        console.log("Error: ", error);
        res.send({ error: error });
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

        let data = getData(result);
        if (data) {
            res.send(data);
        } else {
            res.send({ error: "can't get any data from DB" })
        }

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

        let data = getData(result);

        if (data) {
            res.send(data);
        } else {
            res.send({ error: "can't get any data from DB" })
        }

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

        let data = getData(result);

        if (data) {
            res.send(data);
        } else {
            res.send([]);
        }

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

        let data = getData(result);
        if (data) {
            res.send(data);
        } else {
            res.send([]);
        }

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

        let resultData = getData(result);

        if (resultData) {
            res.send(resultData);
        } else {
            res.send([]);
        }

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

router.get("/api/overallBudgetData", async (req, res) => {

    let overallBudgetData = [{
        2018: [],
        2017: [],
        2016: []
    }];

    try {
        const result = await client.search({
            index: categories,
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
        const result = await client.search({
            index: "kindergartensbystate",
            filterPath: ['hits.hits._source'],
            body: {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_phrase": {
                                    "kindergarten_state": stateName,
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                },
                "size": 30
            }
        });

        const data = getData(result);
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

        const range = 0.14;

        if (state) {
            const lat = state.lat;
            const lon = state.lon;

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

                },

            });


            let data = getData(result);

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
        const youngFamilyData = await getYoungCategoriesByState(stateName);

        if(youngFamilyData) {
            res.send(youngFamilyData);
        } else {
            res.send([]);
        }
    } catch(error) {
        res.send({ error: `Cant get young families index for state name ${stateName}` });
    }
});

module.exports = router;