import express from "express";
import bodyParser from "body-parser";
import mysql2 from "mysql2";

import { fileURLToPath } from "url";
import { dirname } from "path";

const hostname = "localhost";
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/home.html");
});

app.get("/api/register", (req, res) => {
    res.sendFile(__dirname + "/public/register.html");
});

app.listen(port, () => {
    console.log(`Server Running at ${hostname}:${port}`);
});
