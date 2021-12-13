const { Router } = require("express");
const bcrypt = require("bcrypt");
const mysql2 = require("mysql2");
const { register, login, main } = require("../controllers/authCon");
const { check } = require("express-validator");

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

router.get("/create", (req, res) => {
    if (!req.session.authenticated)
        return res.render("create_post", { login: false });

    res.render("create_post", { login: true });
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

const validation = [
    check("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),
    check("password")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters"),
    check("email").isEmail().withMessage("Email is not valid"),
];

router.post("/", main);
router.post("/register", validation, register);
router.post("/login", login);

module.exports = router;
