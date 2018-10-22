const request = require('request');
const express = require('express');
const port = process.env.PORT || 8081;
const app = express();
const cfg = require('./config');

const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');

app.use(bodyParser());

let auth = {
    'user': cfg.shop_id,
    'pass': cfg.secret_key
};


app.post('/bepaid', function (req, res) {
    // console.log(req.body);
    console.log(req);
    res.sendStatus(200);
});



app.listen(port);
console.log("success port "+ port)

require('./app')