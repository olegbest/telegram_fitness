module.exports = {
    async sendText(bot, chat_id, text){
        return await bot.sendMessage(chat_id, text, {parse_mode: "HTMl"})
    },
    async sendButton(bot, chat_id, text, options){
        return await bot.sendMessage(chat_id, text, options)
    }
}