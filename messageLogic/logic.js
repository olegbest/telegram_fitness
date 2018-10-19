const messageUtils = require('../lib/messageUtils');
const bot = require('../src/bot').bot;
const states = require('../data/states');
const databaseUtil = require('../lib/databaseUtil');
const methods = require('../src/methods')

module.exports = {
    async sendMessage(state, msg, nextState, user, data) {
        let tx;
        if (msg.text) {
            tx = msg.text.toLowerCase().trim();
        }

        if (state === "check-gender-profile") {
            if (tx === "женский" || tx === "мужской") {
                await databaseUtil.saveUserData(user.info.id, {gender: tx});
                await this.sendMessage("phone-profile", msg, "check-phone", user, data);
                return;
            } else {
                await this.sendMessage("gender-profile-callback", msg, state, user, {})
                return;
            }

        } else if (state === "check-phone") {
            if (user.phone) {
                await this.sendMessage("email-profile", msg, "check-email", user, data)
                return;
            } else {
                let phone;
                if (msg.text) {
                    phone = msg.text.replace(/(\+)|(-)|( )|(\()|(\))/g, "");
                } else {
                    phone = user.phone;
                }
                if (!isNaN(+phone) && phone.length >= 10 && phone.length <= 14) {
                    await this.sendMessage("email-profile", msg, "check-email", user, data)
                    return;
                } else {
                    await this.sendMessage("check-phone-failed", msg, "check-phone", user, data)
                    return;
                }
            }
        } else if (state === "check-email") {
            let isEmail = validateEmail(msg.text);
            if (isEmail) {
                await databaseUtil.saveUserData(user.info.id, {email: msg.text});
                await this.sendMessage("growth-profile", msg, "check-growth", user, data);
                return;
            } else {
                await this.sendMessage("check-email-failed", msg, "check-email", user, data);
                return;
            }

        } else if (state === "check-growth") {
            if (!isNaN(+msg.text) && +msg.text > 100 && +msg.text < 250) {
                await databaseUtil.saveUserData(user.info.id, {growth: msg.text})
                await this.sendMessage("age-profile", msg, "check-age", user, data);
                return;
            } else {
                await this.sendMessage("check-growth-failed", msg, "check-growth", user, data);
                return;
            }
        } else if (state === "check-age") {
            if (!isNaN(+msg.text) && +msg.text > 10 && +msg.text < 70) {
                await databaseUtil.saveUserData(user.info.id, {age: msg.text});
                await this.sendMessage("weight-profile", msg, "check-weight", user, data);
                return;
            } else {
                await this.sendMessage("check-age-failed", msg, "check-age", user, data);
                return;
            }
        } else if (state === "check-weight") {
            let w = await this.checkWeight(user.activePack, +msg.text);
            console.log(w);
            if (w) {
                await databaseUtil.saveUserData(user.info.id, {weight: msg.text});
                if (!user.city) {
                    await this.sendMessage("city-profile", msg, "time-profile", user, data);
                } else {
                    await this.sendMessage("time-profile", msg, "check-time-profile", user, data);
                }
                return;

            } else {
                this.sendMessage("check-weight-failed", msg, "check-weight", user, data);
                return;
            }
        } else if (state === "check-time-profile") {
            let time = 9;
            if (tx.indexOf("13") > -1) {
                time = 13;
            } else if (tx.indexOf("18") > -1) {
                time = 18;
            } else if (tx.indexOf("21") > -1) {
                time = 21;
            }
            await databaseUtil.saveUserData(user.info.id, {sendTime: time});
            await this.sendMessage("send-photo", msg, "check-send-photo", user, {});
        } else if (state === "check-send-photo") {
            if (tx === "отправить фото") {
                this.sendMessage("send-photo-true", msg, "typing", user, {})
            } else {
                this.sendMessage("skip-send-photo", msg, "typing", user, {})
            }

            await wait(5000);
            let indexPack = await methods.findActivePack(user, user.activePack);
            let purC = user.purchasedCourses;
            let dateLast = new Date(purC[indexPack].lastSendDate);
            dateLast.setHours(dateLast.getHours() + (24 * 6));
            let dateNow = new Date();
            if (purC[indexPack]["now-week"] === 0 || dateNow > dateLast) {
                await this.sendMessage("sendingFiles", msg, "typing", user, data, {});
                await methods.sendActivePack(user.activePack, user, msg);
            }
            await methods.changeSendNextDate(user);
            await this.sendMessage("waitPack", msg, "check-wait-pack", user, {})


        } else if (states[state] && state !== "typing") {
            await databaseUtil.saveUserData(user.info.id, {state: "typing"});
            if (state === "buy-promo-success" || state === "buy") {
                if (user.purchasedCourses.length === 0 || data.course) {
                    let el = states[state].textArray[0];
                    let text = el.value + "\n" + generateLink(150);

                    await messageUtils.sendButton(bot, msg.chat.id, text, {
                        "reply_markup": {
                            "keyboard": el.buttons,
                            "resize_keyboard": true,
                            "one_time_keyboard": true,

                        }
                    });

                    await databaseUtil.saveMessage({
                        userId: user.info.id,
                        message: text,
                        is_bot: true,
                        date: new Date()
                    });
                    await wait(3000);
                    let pay = true;
                    if (pay) {
                        await messageUtils.sendText(bot, msg.chat.id, "Идет проверка оплаты...");
                        await wait(2000);
                        if (user.selectPack === "3" || user.selectPack === "6") {
                            let selPack = states["list"].textArray[user.selectPack];
                            await databaseUtil.saveUserData(user.info.id, {isBuy: true, activePack: user.selectPack});
                            let course = {
                                id: user.purchasedCourses.length,
                                pack: user.selectPack,
                                dateBuy: new Date(),
                                duration: selPack.description.duration / 7,
                                "now-week": 0,
                                isPause: false
                            };
                            let pCourse = user.purchasedCourses;
                            pCourse.push(course);
                            await databaseUtil.saveUserData(user.info.id, {purchasedCourses: pCourse});
                            await this.sendMessage("success-pay", msg, "profile-name", user);
                            if (user.name) {
                                await this.sendMessage("weight-profile", msg, "check-weight", user, data);
                            } else {
                                await this.sendMessage("name-profile", msg, "gender-profile", user);
                            }
                            return
                        } else {
                            await this.sendMessage("failed-pay", msg, "", user);
                            await wait(3000);
                            await this.sendPackageInfo(msg, user.selectPack, user, {});
                        }

                    }
                } else {
                    await this.sendMessage("interrupt-pack", msg, "typing", user, data);
                }
            } else {

                let arr = states[state].textArray;
                if (arr) {
                    for (let i = 0; i < arr.length; i++) {
                        let el = arr[i];
                        let tx = el.value;
                        await bot.sendChatAction(msg.chat.id, "typing");
                        await wait(+el.time);
                        if (el.type === 'text') {
                            // await messageUtils.sendText(bot, msg.chat.id, tx);
                            await messageUtils.sendButton(bot, msg.chat.id, tx, {
                                "reply_markup": {
                                    "remove_keyboard": true

                                }
                            })

                        } else if (el.type === "button") {
                            if (el.buttons) {
                                if (el.buttonType === "inline") {
                                    if (data.editMessage) {
                                        await bot.editMessageText(tx, {
                                            message_id: msg.message_id,
                                            chat_id: msg.chat.id,
                                            "reply_markup": {
                                                "inline_keyboard": el.buttons
                                            }
                                        })
                                    } else {
                                        await messageUtils.sendButton(bot, msg.chat.id, tx, {
                                            "reply_markup": {
                                                "inline_keyboard": el.buttons
                                            }
                                        })
                                    }
                                } else if (el.buttonType === "keyboard") {
                                    await messageUtils.sendButton(bot, msg.chat.id, tx, {
                                        "reply_markup": {
                                            "keyboard": el.buttons,
                                            "resize_keyboard": true,
                                            "one_time_keyboard": true,

                                        }
                                    })
                                }
                            }


                            await databaseUtil.saveMessage({
                                userId: user.info.id,
                                message: tx,
                                is_bot: true,
                                date: new Date()
                            })
                        }

                    }
                }
                let randomText = states[state].buttonArrayRandom;
                if (randomText) {
                    await messageUtils.sendButton(bot, msg.chat.id, randomText[randomInteger(0, randomText.length - 1)], {
                        "reply_markup": {
                            "keyboard": states['gender-profile'].textArray[0].buttons,
                            "resize_keyboard": true,
                            "one_time_keyboard": true
                        }
                    })
                }

            }

            if (state === "time-profile") {
                await databaseUtil.saveUserData(user.info.id, {city: msg.text});
                nextState = "check-time-profile";
            }

            if (state === "gender-profile") {
                await databaseUtil.saveUserData(user.info.id, {name: msg.text});
                nextState = "check-gender-profile"
            }

            await databaseUtil.saveUserData(user.info.id, {
                state: nextState,
                oldState: state
            });
        }
    },

    async sendPackageInfo(msg, idPack, user, data) {
        // console.log(idPack)
        databaseUtil.saveUserData(user.info.id, {state: "typing", oldState: "state0"})
        let pack = states["list"].textArray[idPack];
        if (pack) {
            let p = pack.description.li;
            let info = "";
            info += "<b>" + pack.name + "</b>\n";
            info += "<a href=\"http://www.ufsi24.com/assets/telegram_photo/" + pack.image + "\">&#8204;</a>" + "\n";
            for (let i = 0; i < p.length; i++) {
                info += p[i] + "\n";
            }

            let keyboard = [];

            if (data.isBuy) {
                keyboard = [
                    [
                        {
                            "text": "Назад",
                            "switch_inline_query_current_chat": ""
                        },
                        {
                            "text": "Продолжить курс",
                            "callback_data": JSON.stringify({state: "continue-pack", data: idPack}),
                        }
                    ]
                ]
            } else {
                keyboard = [
                    [
                        {
                            "text": "Назад",
                            "switch_inline_query_current_chat": ""
                        }
                    ],
                    [
                        {
                            "text": "Купить",
                            "callback_data": JSON.stringify({state: "buy", data: idPack}),
                        },
                        {
                            "text": "Купить по промокоду",
                            "callback_data": JSON.stringify({state: "buy-promo", data: idPack}),
                        }
                    ]
                ]
            }

            if (!data.editMessage) {

                await messageUtils.sendButton(bot, msg.chat.id, info, {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "inline_keyboard": keyboard
                    }
                });
            } else {
                await bot.editMessageText(info, {
                    message_id: msg.message_id,
                    chat_id: msg.chat.id,
                    parse_mode: "HTML",
                    "reply_markup": {
                        "inline_keyboard": keyboard
                    }
                });
            }
            await databaseUtil.saveMessage({userId: user.info.id, message: info, is_bot: true, date: new Date()})
            databaseUtil.saveUserData(user.info.id, {
                selectPack: idPack
            })
        }
    },

    async checkWeight(pack, text) {
        let w = states["list"].textArray[+pack].description.weight;
        console.log(w);
        return !isNaN(+text) && text > w[0] && text < w[1];
    }
}


function generateLink(price) {
    return "http://ufsi24.com/";
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function validateEmail(email) {
    let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
}

function validateNumberPhone(phone) {
    let pattern = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

}