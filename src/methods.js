const bot = require('./bot').bot;
const states = require('../data/states');
const databaseUtil = require('./../lib/databaseUtil');
const fs = require('fs');

module.exports = {
    async sendActivePack(pack, user, msg) {
        let folder = states["list"].textArray[pack].description.folder;
        let dir = `${__dirname}/../${folder}/${user.weight}/`;
        let item = await fs.readdirSync(dir);
        if (item) {
            for (let i = 0; i < item.length; i++) {
                let doc = dir + item[i];
                await wait(500);
                await bot.sendDocument(msg.chat.id, doc, {});
            }
        }
        let indexPack = await this.findActivePack(user, user.activePack);
        let purC = user.purchasedCourses;
        let week = purC[indexPack]["now-week"];
        purC[indexPack]["now-week"]++;
        await bot.sendMessage(msg.chat.id, states["send-video"][week]);

        await databaseUtil.saveUserData(user.info.id, {purchasedCourses: purC});
    },

    async findActivePack(user, pack) {
        let arr = user.purchasedCourses;
        for (let i = 0; i < arr.length; i++) {
            let el = arr[i];
            if (el.pack === pack) {
                return i;
            }
        }
    },

    async changeSendNextDate(user) {
        let indexPack = await this.findActivePack(user, user.activePack);
        let purC = user.purchasedCourses;
        let date = new Date();
        date.setHours(date.getHours() + (24 * 7));
        date.setHours(user.sendTime);
        purC[indexPack].sendNextDate = date;
        purC[indexPack].lastSendDate = new Date();
        await databaseUtil.saveUserData(user.info.id, {purchasedCourses: purC})
    },
    async findAndUpdatePromocode(text) {
        let promo = await databaseUtil.findPromo(text);
        console.log(promo);
        if (promo) {
            console.log(promo);
            if (promo.type) {
                let t = promo.type;
                if (t === "1") {
                    if (promo.number_of_use > 0) {
                        await databaseUtil.updatePromo(text, {number_of_use: promo.number_of_use - 1});
                        return promo.discount;
                    }
                } else if (t === "2") {

                }
            }
        } else {
            return false;
        }
    }
};

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}