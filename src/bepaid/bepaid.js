const request = require('request');
const express = require('express');
const port = process.env.PORT || 8081;
const app = express();
const cfg = require('./config');

const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');

app.use(bodyParser());

app.post('/bepaid', function (req, res) {
    console.log(req);
    console.log(req.hostname);
    let data = req.body;
    if(data){
        console.log(data.transaction);
    }
    res.sendStatus(200);
});



app.listen(port);
console.log("success port "+ port)

require('./app')