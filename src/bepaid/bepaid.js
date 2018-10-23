const express = require('express');
const port = process.env.PORT || 8081;
const app = express();
const logic = require('./../../messageLogic/logic');
const databaseUtil = require('./../../lib/databaseUtil')

const bodyParser = require('body-parser');

app.use(bodyParser());

app.post('/bepaid', async function (req, res) {
    console.log(req);
    console.log(req.hostname);
    let data = req.body;
    if (data) {
        if (data.transaction) {
            let t = data.transaction;
            let user = databaseUtil.findUser(+t.tracking_id);
            let msg = {};
            msg.chat= {};
            msg.chat.id = user.chat_id;
            if (t.status === "successful") {

                await logic.successBuy(msg, user, "success")
            }
        }
    }
    res.sendStatus(200);
});


app.listen(port);
console.log("success port " + port)

require('./app')