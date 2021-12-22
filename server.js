const express = require("express");
const pages = require("./routes/pages");
const authCon = require("./controllers/authCon");
const session = require("express-session");
const { conn } = require("./controllers/dbCon");
const path = require("path");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    session({
        secret: "Secret Key",
        path: "/",
        cookie: { maxAge: 300000 },
        resave: false,
        saveUninitialized: false,
    })
);

conn.connect((err) => {
    if (err) throw err;
    console.log("MySQL WorkBench is connected");
});

app.use("/", pages);

app.listen(PORT, () => {
    console.log(`Server running at localhost:${PORT}`);
});
