class Routes {
    constructor(app) {
        this.app = app;
    }

    setup() {
        this.app.post('/blinger-messages', async function (req, res) {
            console.log(req.body);
            res.sendStatus(200);
        })
    }
}

module.exports = Routes;