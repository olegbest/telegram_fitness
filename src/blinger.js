const requset = require('request');

module.exports = {
    async sendMessageBlinger(msg) {
        return await new Promise((resolve) => {
            let blingerMsg = {
                "update_id": +new Date(),
                "message": msg
            }

            console.log(blingerMsg);

            requset.post({
                url: "https://api.blinger.ru/telegram_bot_webhook?user_id=1552498", json: blingerMsg

            }, function (err, httpRes, body) {
               if(err){
                   console.log(err);
                   console.log(body);
               }

               resolve(body)
            });
        })

    }
}