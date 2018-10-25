module.exports = {
    async answerMessage(msg, databaseUtil, logic, blinger, states, methods) {

        console.log(msg);

        let user;
        user = await databaseUtil.findUser(msg.from.id);
        if (!user) {
            user = await databaseUtil.createUser(msg.from, msg)
        }

        if (msg.contact) {
            let cont = msg.contact;
            if (cont.phone_number) {
                await databaseUtil.saveUserData(user.info.id, {phone: cont.phone_number});
                user = await databaseUtil.findUser(user.info.id);
                await logic.sendMessage(user.state, msg, user.state, user, {});
            }

        }

        await databaseUtil.saveMessage({
            userId: msg.from.id,
            message: msg.text,
            is_bot: msg.from.is_bot,
            date: new Date()
        });

        if (msg.text) {
            let tx = msg.text.toLowerCase().trim();
            if (user.state !== "online-consultant-typing") {
                if (user.state === "check-weight-buyer") {
                    let w = await logic.checkWeight(user.activePack, msg.text);
                    if (w) {
                        let wg = msg.text;
                        if (user.weight === wg) {
                            wg = wg - 2;
                        }
                        await databaseUtil.saveUserData(user.info.id, {weight: wg});
                        user = await databaseUtil.findUser(user.info.id);
                        await methods.changeSendNextDate(user);
                        await methods.sendActivePack(user.activePack, user, msg);
                        await logic.sendMessage("waitPack", msg, "typing", user, {})
                    } else {
                        await logic.sendMessage("check-weight-failed", msg, "check-weight-buyer", user, {});
                    }
                } else {
                    if (msg.text.toLowerCase().trim() === "/start") {
                        await databaseUtil.saveUserData(msg.from.id, {state: "state0"});
                        user = await databaseUtil.findUser(user.info.id);
                        await logic.sendMessage(user.state, msg, "typing", user, {})
                    } else {
                        if ((user.oldState === "buy" || user.oldState === "buy-promo-success") && tx === "назад") {
                            await logic.sendPackageInfo(msg, user.selectPack, user, {});
                            await databaseUtil.saveUserData(msg.from.id, {oldState: "state0"})
                        } else if ((user.oldState === "buy-promo" || user.oldState === "buy-promo-failed") && user.state !== "state0") {
                            let promo = await methods.findPromocode(msg.text);
                            if (msg.text === "olegbest") {
                                await logic.sendMessage("buy-promo-success", msg, "typing", user, {})
                            } else if (tx === "назад") {
                                await logic.sendPackageInfo(msg, user.selectPack, user, {})
                            } else {
                                await logic.sendMessage("buy-promo-failed", msg, "buy-promo", user, {})
                            }
                        } else {
                            let nextState;
                            if (states[user.state]) {
                                if (states[user.state].nextState) {
                                    nextState = states[user.state].nextState;
                                } else {
                                    nextState = "typing"
                                }
                            }
                            if (msg.entities) {
                                let url = msg.entities[0];
                                if (url.url) {
                                    url = url.url;
                                    let id = url.split("/");
                                    id = +id[id.length - 1];
                                    await logic.sendPackageInfo(msg, id, user, {})
                                } else {
                                    await logic.sendMessage(user.state, msg, nextState, user, {})
                                }
                            } else {

                                await logic.sendMessage(user.state, msg, nextState, user, {})
                            }
                        }
                    }
                }
            } else if (user.state === "online-consultant-typing") {
                user = await databaseUtil.findUser(user.info.id);
                if (user.isBuy) {
                    if (msg.text.toLowerCase().trim() === "закончить разговор") {
                        await logic.sendMessage("online-consultant-end", msg, "typing", user, {})
                    } else {
                        await blinger.sendMessageBlinger(msg);
                    }
                }
            }
        }

    }
}