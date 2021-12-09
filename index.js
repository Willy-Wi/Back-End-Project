const express = require("express");
const bodyParser = require("body-parser");
const mysql2 = require("mysql2");
const fileUpload = require("express-fileupload");

const port = 3000;

const app = express();
const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_db",
});

conn.connect((err) => {
    if (err) throw err;
    console.log("MySQL WorkBench is Connected...!");
});

app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(fileUpload());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/public/register.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

// ! Work in Progress

app.post("/", (req, res) => {
    if (!req.files) return; // res.status(400).sendFile(__dirname + "/public/home.html");

    let file = req.files.afp;

    let uploadPath = __dirname + "/uploads/" + file.name;

    file.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);
        // res.sendFile(__dirname + "/public/home.html");
    });
});

app.listen(port, () => {
    console.log(`Server Running at localhost:${port}`);
});
