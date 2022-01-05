const express = require("express");
const session = require("express-session");
const pages = require("./routes/pages");
const { conn } = require("./controllers/dbCon");
const upload = require("express-fileupload");
const path = require("path");
const app = express();
const PORT = 3000;

conn.connect((err) => {
    if (err) throw err;
    console.log("MySQL WorkBench is connected");
});

app.set("view engine", "ejs");

app.use(
    session({
        secret: "Secret Key",
        path: "/",
        cookie: { maxAge: 300000 },
        resave: false,
        saveUninitialized: false,
    })
);
app.use(upload());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use("/", pages);

app.listen(PORT, () => {
    console.log(`Server running at localhost:${PORT}`);
});
