const databaseModel = require('./databaseController').Model_telegram_fitness_bot;
const messageModel = require('./databaseController').Model_telegram_fitness_bot_message;
const promoModel = require('./databaseController').Model_telegram_fitness_bot_promo;
const packagesModel = require('./databaseController').Model_telegram_fitness_bot_packages;

module.exports = {
    async findUser(id) {
        return await databaseModel.findOne({"info.id": id});
    },
    async createUser(info, msg) {
        let user = new databaseModel({
            info: info,
            state: "state0",
            joinDate: new Date(),
            purchasedCourses: [],
            chat_id: msg.chat.id
        });
        await user.save();
        return user;
    },
    async saveUserData(id, data) {
        return await new Promise((resolve) => {
            databaseModel.findOneAndUpdate({"info.id": id}, data, (err, res) => {
                resolve(res);
            })
        })

    },
    async saveMessage(info) {
        let message = new messageModel(info);
        await message.save();
        return message;
    },
    async findSomeUser(options) {
        return await databaseModel.find(options)
    },
    async findPromo(txt) {
        return await promoModel.findOne({value: txt})
    },
    async updatePromo(txt, data) {
        return await promoModel.findOneAndUpdate({value: txt}, data);
    },
    async newPackage(data) {
        let pack = new packagesModel(data);
        return await pack.save();
    },
    async updatePackage(idPack, data) {
        let pack = await packagesModel.findOne({id: idPack});
        if (pack) {
            pack.number_of_buy++;
            return await pack.save();
        } else {
            return await this.newPackage({id: idPack, name: data.name, number_of_buy: 1})
        }

    }
};