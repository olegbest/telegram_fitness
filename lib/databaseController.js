const mongoose = require('mongoose');

let mongooseSchema = {
    info: {type: Object, required: false},
    state: {type: String, required: false},
    oldState: {type: String, required: false},
    joinDate: {type: String, required: false},
    selectPack: {type: String, required: false},
    activePack: {type: String, required: false},
    name: {type: String, required: false},
    gender: {type: String, required: false},
    phone: {type: String, required: false},
    email: {type: String, required: false},
    age: {type: String, required: false},
    growth: {type: String, required: false},
    weight: {type: String, required: false},
    sendTime: {type: String, required: false},
    sendNextDate: {type: String, required: false},
    isBuy: {type: Boolean, required: false},
    dateBuy: {type: String, required: false},
    dateEndCourse: {type: String, required: false},
    purchasedCourses: {type: Array, required: false},
    chat_id: {type: String, required: false},
    city: {type: String, required: false}
};

let messageSchema = {
    userId: {type: String, required: false},
    message: {type: String, required: false},
    is_bot: {type: Boolean, required: false},
    date: {type: String, required: false}
}

let telegram_fitness_bot = mongoose.createConnection('mongodb://localhost/telegram_UFSi_fitness_bot', {useNewUrlParser: true});

let Schema = new mongoose.Schema(mongooseSchema);
let Message = new mongoose.Schema(messageSchema)

let Model_telegram_fitness_bot = telegram_fitness_bot.model('user', Schema);
let Model_telegram_fitness_bot_message = telegram_fitness_bot.model('message', Message);

module.exports.Model_telegram_fitness_bot = Model_telegram_fitness_bot;
module.exports.Model_telegram_fitness_bot_message = Model_telegram_fitness_bot_message;