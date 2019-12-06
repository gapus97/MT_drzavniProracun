const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
const express = require('express');
const app = express();
const port = 3500;
const cors = require('cors');

app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => {
    res.send('API is working!')
});

app.get("/statesOutcome/name=:name", async (req, res) => {
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
        res.send({ error: error });
    }

});


app.get("/loansAndCapital/name=:name", async (req, res) => {
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

app.get("/investmentTransfers/name=:name", async (req, res) => {
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


app.get("/investmentOutgoings/name=:name", async (req, res) => {
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

app.get("/debtPayment/name=:name", async (req, res) => {
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

app.get("/currentTransfers/name=:name", async (req, res) => {
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
// start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))