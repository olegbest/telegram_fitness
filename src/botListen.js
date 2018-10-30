const bot = require('./bot').bot;
const on_message = require('../messageLogic/on_message');
const callback_query = require('../messageLogic/callback_query');
const blinger = require('./blinger');
const databaseUtil = require('./../lib/databaseUtil');
const logic = require('../messageLogic/logic');
const states = require('../data/states');
const methods = require('./methods');
require('./bepaid/bepaid');

bot.on('message', async (msg) => {
    on_message.answerMessage(msg, databaseUtil, logic, blinger, states, methods);
});

bot.on('callback_query', async (msg) => {
    callback_query.answerQuery(msg);
});

bot.on("inline_query", async (query) => {

    let user = await databaseUtil.findUser(query.from.id);
    await methods.updateStageStates(user, "list");

    let list = states['list'].textArray;
    let arr = [];
    for (let i = 0; i < list.length; i++) {
        arr.push({
            "id": "2" + i,
            "type": "article",
            "title": list[i].name,
            "description": list[i].description.title,
            "photo_url": "http://www.ufsi24.com/assets/telegram_photo/" + list[i].image,
            "thumb_url": "http://www.ufsi24.com/assets/telegram_photo/" + list[i].image,
            "input_message_content": {
                "parse_mode": "HTML",
                "message_text": "Хочу \n" + list[i].name + "\n <a href=\"https://trello-attachments.s3.amazonaws.com/" + i + "\">&#8204;</a>"
            }
        })
    }
    await bot.answerInlineQuery(query.id, arr, {
        cashe_time: 0
    })
});

setInterval(async function () {
    let users = await databaseUtil.findSomeUser({isBuy: true});
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.isBuy) {
            let indexPack = await methods.findActivePack(user, user.activePack);
            let purC = user.purchasedCourses;
            if (+indexPack >= 0) {
                let msg = {};
                msg.chat = {};
                msg.chat.id = user.chat_id;
                if (!purC[indexPack].isPause) {
                    let pack = purC[indexPack];
                    if (pack["now-week"] < pack.duration) {

                        if (pack.sendNextDate < new Date() && user.state !== "check-weight-buyer") {
                            await logic.sendMessage("weight-profile-after-buy", msg, "check-weight-buyer", user, {});
                        }
                    } else if (pack["now-week"] === pack.duration) {

                        if (pack.duration === 12) {
                            await logic.sendMessage("end-course-3-month", msg, "typing", user, {});
                            await logic.sendMessage("3-month-course", msg, "typing", user, {});
                        } else {
                            await logic.sendMessage("end-course", msg, "typing", user, {});
                        }
                        purC.splice(indexPack, 1);
                        await databaseUtil.saveUserData(user.info.id, {purchasedCourses: purC});
                        if (purC.length === 0) {
                            await databaseUtil.saveUserData(user.info.id, {isBuy: false});
                        }
                    }
                }
            }
        }
    }
}, 60 * 1000);