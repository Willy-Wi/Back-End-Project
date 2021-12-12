const { Router } = require("express");
const bcrypt = require("bcrypt");
const mysql2 = require("mysql2");
const { register, login, main } = require("../controllers/authCon");

const router = Router();

const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_db_home",
});

router.get("/", async (req, res) => {
    let sql = "SELECT * FROM comments";

    let query = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    });

    if (!req.session.authenticated)
        return res.render("home", { login: false, result: query });

    res.render("home", { result: query, login: true });
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/logout", (req, res) => {
    if (req.session.authenticated) {
        req.session.authenticated = false;
        return res.redirect("/");
    }
    res.render("login", { message: "You are not logged in!" });
});

router.post("/", main);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
