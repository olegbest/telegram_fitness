var request = require('request');
const cfg = require('./config')

var headers = {
    'Content-type': 'application/json'
};

let auth = {
    'user': cfg.shop_id,
    'pass': cfg.secret_key
};

var dataString = {
    "checkout": {
        "version": 2.1,
        "test": true,
        "transaction_type": "payment",
        "attempts": 3,
        "settings": {
            "success_url": "https://ufsi24.com",
            "decline_url": "https://ufsi24.com",
            "fail_url": "https://ufsi24.com",
            "cancel_url": "https://ufsi24.com",
            "notification_url": "http://185.179.83.31:8081/bepaid",
            "language": "ru",
            "customer_fields": {
                "read_only": ["email"]
            }
        },
        "order": {
            "currency": "BYN",
            "amount": 412,
            "description": "Order description"
        },
        "customer": {
            "email": "jake@example.com"
        }
    }
};

var options = {
    url: 'https://checkout.bepaid.by/ctp/api/checkouts',
    method: 'POST',
    headers: headers,
    body: JSON.stringify(dataString),
    auth: auth
};

function callback(error, response, body) {

    console.log(body);

}

request(options, callback);
