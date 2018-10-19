const databaseModel = require('./databaseController').Model_telegram_fitness_bot;
const messageModel = require('./databaseController').Model_telegram_fitness_bot_message;
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
    async findSomeUser(options){
        return await databaseModel.find(options)
    }
};