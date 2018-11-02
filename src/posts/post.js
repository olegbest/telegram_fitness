class Routes {
    constructor(app) {
        this.app = app;
    }

    setup() {
        this.app.post('/blinger-messages', async function (req, res) {
            console.log("Работает")
        })
    }
}

module.exports = Routes;