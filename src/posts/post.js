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
                if (req.body.webhook = 'on_message_incoming') {
                    let data = req.body;
                    let text = `Не прочитанное сообщение от \nid: ${data['from_user'].user_id} \ntitle: ${data['from_user'].title} \napplication: ${data['from_user'].application}`;
                    let chat_id = -1001348598411;
                    await messageUtils.sendText(bot, chat_id, text);
                }
                console.log(req.body);
            }
        })
    }
}

module.exports = Routes;