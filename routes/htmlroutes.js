const path = require("path");

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    })

    app.get("/calendar", function (req, res) {
        res.sendFile(path.join(__dirname, '../calendar.html'));
    })

    app.get("/chat", function (req, res) {
        res.sendFile(path.join(__dirname, '../chat.html'));
    })
}