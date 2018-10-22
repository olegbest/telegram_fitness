const request = require('request');
const express = require('express');
const port = process.env.PORT || 80;
const app = express();
const cfg = require('./config')

const https = require('https');
const fs = require('fs');
const path = require('path');

let auth = {
    'user': cfg.shop_id,
    'pass': cfg.secret_key
};

// app.use('/test', express.static(path.join(__dirname, '../../', 'client')));

app.post('/bepaid', function (req, res) {
    console.log("ds");
    res.sendStatus(200);
})

const httpsOptions = {
    cert: cfg.sert,
    key: cfg.sertkey
};

https.createServer(httpsOptions, app).listen(port, function () {
    console.log("server on port " + port)
})