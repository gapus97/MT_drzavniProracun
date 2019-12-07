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

const supportedYears = [2016, 2017, 2018];

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

        if (result.body.hits) {
            res.send(result.body.hits);
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

        if (result.body.hits) {
            res.send(result.body.hits);
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

        if (result.body.hits) {
            res.send(result.body.hits);
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

        if (result.body.hits) {
            res.send(result.body.hits);
        } else {
            res.send({ error: "can't get any data from DB" })
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

        if (result.body.hits) {
            res.send(result.body.hits);
        } else {
            res.send({ error: "can't get any data from DB" })
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

        if (result.body.hits) {
            res.send(result.body.hits);
        } else {
            res.send({ data: "empty data" })
        }

    } catch (error) {
        res.send({ error: error });
    }

});

router.get("/api/states", async (req, res) => {
    try {
        const result = await client.search({
            index: 'states',
            body: {
                "query": {
                    "match_all": {}
                },
                'size': 300
            },

        });

        if (result.body.hits) {
            res.send(result.body.hits);
        } else {
            res.send({ data: "empty data" })
        }

    } catch (error) {
        res.send({ error: error });
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

        if(data) {
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
            
        }

        if (overallBudgetData) {
            res.send(overallBudgetData);
        } else {
            res.send({ data: "empty data" })
        }
    } catch (error) {
        res.send({ error: error });
    }

});


module.exports = router;