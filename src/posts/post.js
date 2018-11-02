const messageUtils = require('./../../lib/messageUtils');
const bot = require('./../bot').bot;

class Routes {
    constructor(app) {
        this.app = app;
    }

    setup() {
        this.app.post('/blinger-messages', async function (req, res) {
            res.sendStatus(200);
            if (req.body) {
                console.log(req.body);
                if (req.body.webhook === 'on_conversation_unassigned') {
                    let data = req.body.conversation;
                    let text = `Не прочитанное сообщение от \nid: ${data['from_user'].user_id} \ntitle: ${data['from_user'].title} \napplication: ${data.application}`;
                    let chat_id = -1001348598411;
                    await messageUtils.sendText(bot, chat_id, text);
                }
            }
        })
    }
}

module.exports = Routes;