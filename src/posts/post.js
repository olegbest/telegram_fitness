class Routes {
    constructor(app) {
        this.app = app;
    }

    setup() {
        this.app.post('/blinger-messages', async function (req, res) {
            console.log(req.body);
        })
    }
}

module.exports = Routes;