const express = require("express");
const { google } = require('googleapis');

const app = express();

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';


var PORT = process.env.PORT || 8080;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("./assets"));

require("./assets/routes/htmlroutes")(app);




app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
})