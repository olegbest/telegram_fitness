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

    async generateLink(user, pack, discount) {
        return await new Promise(async (resolve) => {
            let idUser = user.info.id;
            let currency = await getCurrency();
            console.log(currency);
            let country;

            let price = pack.price;

            if(user.country === "беларусь"){
                country = "BYN";
                price = ((+currency.USD_in + (+currency.USD_out)) / 2) * price;
            } else if (user.country === "россия"){
                country = "RUB";
                price = +currency.USD_RUB_in * price;
            } else {
                country = "USD"
            }

            price = Math.floor(price * 100);
            price = Math.floor((price * (100 - discount)) / 100);
            console.log("Цена "+price);
            console.log("Скидка "+ discount);
            let dataString = {
                "checkout": {
                    "version": 2.1,
                    "test": true,
                    "transaction_type": "payment",
                    "attempts": 1,
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
                        "currency": country,
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
            url: "https://belarusbank.by/api/kursExchange?city=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA",
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