const { Router } = require("express");
const bcrypt = require("bcrypt");
const mysql2 = require("mysql2");
const { register, login, create_post } = require("../controllers/authCon");
const { check } = require("express-validator");

const router = Router();

const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_db_home",
});

router.get("/", async (req, res) => {
    let sql = "SELECT * FROM posts";

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
        return res.render("login", { message: "You have not logged in!" });

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

const validationLogin = [
    check("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),
    check("password")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters"),
    check("email").isEmail().withMessage("Email is not valid"),
];

const validatePost = [
    check("post_message")
        .isLength({ min: 1, max: 1000 })
        .withMessage(
            "Character must be at least 10 with a limit of 510 characters"
        ),
];

router.post("/create", validatePost, create_post);
router.post("/register", validationLogin, register);
router.post("/login", login);

module.exports = router;
