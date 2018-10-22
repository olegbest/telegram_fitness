const request = require('request');
const cfg = require('./config');

let headers = {
    'Content-type': 'application/json'
};

let auth = {
    'user': cfg.shop_id,
    'pass': cfg.secret_key
};

module.exports = {

    async generateLink(idUser) {
        return await new Promise((resolve) => {
            let dataString = {
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
                        "language": "ru"
                    },
                    "order": {
                        "tracking_id": `${idUser}`,
                        "currency": "BYN",
                        "amount": 412,
                        "description": "Order description"
                    }
                }
            };

            let options = {
                url: 'https://checkout.bepaid.by/ctp/api/checkouts',
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dataString),
                auth: auth
            };


            request(options, (error, response, body) => {

                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    console.log(e)
                }


            });
        })
    }
};
