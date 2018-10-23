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

    async generateLink(idUser, pack) {
        return await new Promise(async (resolve) => {
            let currency = await getCurrency();
            let price = pack.price * 100;
            price = ((+currency.USD_in + (+USD_out)) / 2) * price;
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
                        "amount": price,
                        "description": pack.name || "Fitness"
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

async function getCurrency() {
    return await new Promise(resolve => {
        let options = {
            url: "https://belarusbank.by/api/kursExchange",
            method: 'GET'
        };
        request(options, (error, response, body) => {

            try {
                resolve(JSON.parse(body)[0]);
            } catch (e) {
                console.log(e)
            }


        });

    })
}

getCurrency()