const request = require('request');
const express = require('express');
const port = process.env.PORT || 8081;
const app = express();
const cfg = require('./config')

const https = require('https');
const fs = require('fs');

let auth = {
    'user': cfg.shop_id,
    'pass': cfg.secret_key
}

let headers = {
    'Content-Type': 'application/json'
};


app.post('/bepaid', function (req, res) {
    console.log(req.hostname);
    // console.log(res)
    res.send(200);
});

app.get('/', function (req, res) {
    res.send("Hi")
})


const optionsCert = {
    key: cfg.sertkey,
    cert: cfg.sert
};


https.createServer(optionsCert, app).listen(port,(req, res) => {

});