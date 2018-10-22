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
    "notification_url": "http://185.179.83.31:8081/bepaid",
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
        "test": "true",
        "notification_url": "http://185.179.83.31:8081/bepaid",
    }
};


let dataBody = {
    "checkout": {
        "version": 2.1,
        "test": true,
        "transaction_type": "payment",
        "attempts": 3,
        "settings": {
            "success_url": "http://127.0.0.1:4567/success",
            "decline_url": "http://127.0.0.1:4567/decline",
            "fail_url": "http://127.0.0.1:4567/fail",
            "cancel_url": "http://127.0.0.1:4567/cancel",
            "notification_url": "http://your_shop.com/notification",
            "language": "en",
            "customer_fields": {
                "visible": ["first_name", "last_name"],
                "read_only": ["email"]
            }
        },
        "order": {
            "currency": "GBP",
            "amount": 4299,
            "description": "Order description"
        },
        "customer": {
            "address": "Baker street 221b",
            "country": "GB",
            "city": "London",
            "email": "jake@example.com"
        }
    }
}

let options = {
    url: 'https://api.bepaid.by/products',
    method: 'POST',
    headers: headers,
    body: JSON.stringify(dataString),
    auth: auth
};

let options2 = {
    url: 'https://checkout.bepaid.by/ctp/api/checkouts',
    method: 'POSt',
    headers: headers,
    body: JSON.stringify(dataBody)
}

function callback(error, response, body) {
    console.log(body);
    let res = JSON.parse(body)

    console.log(`https://api.bepaid.by/products/${res.id}/pay`)
}

// request(options2, callback);


app.post('/bepaid', function (req, res) {
    console.log(req.hostname);
    // console.log(res)
    res.send(200);
});

app.get('/', function (req,res) {
    res.send("Hi")
})


const optionsCert = {
    key: cfg.sertkey,
    cert: cfg.sert
};

https.createServer(optionsCert,app, (req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
}).listen(port);