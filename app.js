var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var viewpath = path.join(__dirname, "views");
var mysql = require('mysql');
var json2html = require('node-json2html');
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "pug");

var connection = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
    database: "simple"

});

connection.connect();

app.post("/write", function (req, res) {
    var posting = {
        username: req.body.username,
        message: req.body.message
    };

    connection.query("INSERT INTO info SET ?", posting, function (err) {
        if (err) {
            throw err;
        }
    });

    connection.end(function () {
        res.send("Message posted.");
    });
});


app.get("/", function (req, res, next) {
    res.sendFile(path.join(viewpath, 'index.html'));
});


app.get("/lists", function (req, res) {
    connection.query("SELECT * from info", function (err, data) {
        if (err) {
            throw err;
        }
        else {
            var transform = { "<>": "div", "html": "${username} ${message}" };
            var html = json2html.transform(data, transform);
            res.send(html);
        }
    });
});


app.get("/write", function (req, res) {
    res.sendFile(path.join(viewpath, "write.html"));
});


app.listen(3000, function () {
    console.log("Server started at port 3000");
});