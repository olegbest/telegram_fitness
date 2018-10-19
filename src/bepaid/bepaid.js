const request = require('request');
const express = require('express');
const port = process.env.PORT || 8081;
const app = express();
const cfg = require('./config')

let headers = {
    'Content-Type': 'application/json'
};

let dataString = {
    "name": "Test Product name",
    "description": "Description",
    "currency": "BYN",
    "amount": "2500",
    "infinite": "true",
    "visible_fields": null,
    "test": "true",
    "immortal": "true",
    "return_url": "http://return-url.com",
    "shop_id": cfg.shop_id,
    "language": "en",
    "transaction_type": "payment",
    "product": {
        "shop_id": cfg.shop_id,
        "name": "Product name",
        "description": "Description",
        "currency": "BYN",
        "amount": "2500",
        "infinite": "true",
        "return_url": "http://return-url.com",
        "language": "ru",
        "immortal": "true",
        "transaction_type": "payment",
        "visible_fields": null,
        "test": "true"
    }
};

let options = {
    url: 'https://api.bepaid.by/products',
    method: 'POST',
    headers: headers,
    body: JSON.stringify(dataString),
    auth: {
        'user': cfg.shop_id,
        'pass': cfg.secret_key
    }
};

function callback(error, response, body) {
    console.log(body);
}

// request(options, callback);


app.post('/bepaid', function (req, res) {
    console.log(req)
    // console.log(res)
    res.send(200);
});

app.listen(port);
console.log('The magic happens on port ' + port);