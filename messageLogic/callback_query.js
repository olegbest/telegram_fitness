const bot = require('../src/bot').bot;
const databaseUtil = require('../lib/databaseUtil');
const logic = require("./logic");
const methods = require('../src/methods')

module.exports = {
    async answerQuery(msg) {
        console.log(msg);
        await bot.answerCallbackQuery({"callback_query_id": msg.id});
        let user;
        user = await databaseUtil.findUser(msg.from.id);
        if (!user) {
            user = await databaseUtil.createUser(msg.from, msg.message)
        }

        await methods.updateStageStates(user, user.state);

        if (user.state !== "check-weight-buyer" && user.state !== "online-consultant-typing") {

            let data = JSON.parse(msg.data);
            if (data.state === "goPack") {
                await logic.sendPackageInfo(msg.message, user.selectPack, user, {editMessage: true})
            } else if (data.state === "check-time-profile") {
                await databaseUtil.saveUserData(user.info.id, {sendTime: data.time});
                await logic.sendMessage("send-photo", msg.message, "typing", user, {});
            } else if (data.state === "check-send-photo") {
                await logic.sendMessage(data.data, msg.message, "sendingFiles", user, data, {});
                await wait(5000);
                let indexPack = await methods.findActivePack(user, user.activePack);
                let purC = user.purchasedCourses;
                let dateLast = new Date(purC[indexPack].lastSendDate);
                dateLast.setHours(dateLast.getHours() + (24 * 6));
                let dateNow = new Date();
                if (purC[indexPack]["now-week"] === 0 || dateNow > dateLast) {
                    await logic.sendMessage("sendingFiles", msg.message, "typing", user, data, {});
                    await methods.sendActivePack(user.activePack, user, msg.message);
                }
                await methods.changeSendNextDate(user);
                await logic.sendMessage("waitPack", msg.message, "check-wait-pack", user, {})
            } else if (data.state === "online-consultant") {
                user = await databaseUtil.findUser(user.info.id);
                if (user.isBuy) {
                    await logic.sendMessage("online-consultant", msg.message, "online-consultant-typing", user, {})
                }

            } else if (data.state === "interrupt-pack") {
                data.editMessage = true;
                if (data.data) {
                    await logic.sendMessage("interrupt-pack-true", msg.message, "typing", user, data);
                    user = await databaseUtil.findUser(user.info.id);
                    let indexPack = await methods.findActivePack(user, user.selectPack);
                    let pack = user.purchasedCourses[indexPack];
                    if (pack) {
                        let purC = user.purchasedCourses;
                        purC[indexPack].isPause = true;
                        await databaseUtil.saveUserData(user.info.id, {purchasedCourses: purC});
                        await logic.sendPackageInfo(msg.message, pack.pack, user, {isBuy: true})
                    } else {
                        user = await databaseUtil.findUser(user.info.id);
                        await logic.sendMessage("buy", msg.message, "typing", user, {course: true})
                    }
                } else {
                    await logic.sendMessage("interrupt-pack-false", msg.message, "typing", user, data);
                }
            } else if (data.state === "continue-pack") {
                let indexPack = await methods.findActivePack(user, data.data);
                let purC = user.purchasedCourses;
                purC[indexPack].isPause = false;
                await databaseUtil.saveUserData(user.info.id, {purchasedCourses: purC});
                await logic.sendMessage("weight-profile", msg.message, "check-weight", user, data);
            } else {
                data.editMessage = true;
                await logic.sendMessage(data.state, msg.message, data.data, user, data)

            }
        }
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}