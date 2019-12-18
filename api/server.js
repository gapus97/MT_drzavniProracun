const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3500;
const cors = require('cors');
const router = require('./router');
const publicPath = path.join(__dirname, '../app/build');





app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));
app.use(router);

// start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
