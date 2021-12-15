const { Router } = require("express");
const { register, login, create_post } = require("../controllers/authCon");
const { check } = require("express-validator");
const { conn } = require("./database_conn");

const router = Router();

function query(sql) {
    return new Promise((resolve, reject) => {
        conn.query(sql, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

router.get("/search", async (req, res) => {
    const filter = req.query.search;
    if (filter < 1) return res.redirect("/");

    let sql = `SELECT Users.username, Users.name, Posts.post_text
    FROM Users INNER JOIN Posts ON Users.user_id = Posts.user_id
    WHERE Users.username LIKE '%${filter}%' OR
    Users.name LIKE '%${filter}%' OR
    Posts.post_text LIKE '%${filter}%'`;

    let result = await query(sql);

    if (!req.session.authenticated) {
        return res.render("home", { login: false, result: result });
    }

    res.render("home", { result:  result, login: true });
});

router.get("/", async (req, res) => {
    let sql = `SELECT Users.username, Users.name, Posts.post_text
    FROM Posts INNER JOIN Users 
    ON Users.user_id = Posts.user_id`;

    let result = await query(sql);
    
    if (!req.session.authenticated) {
        return res.render("home", { login: false, result:  result });
    }
    res.render("home", { result:  result, login: true });
});

router.get("/create", (req, res) => {
    if (!req.session.authenticated) {
        return res.render("login", { message: "You have not logged in!" });
    }
    res.render("create_post", { login: true });
});

router.get("/register", (req, res) => {
    if (!req.session.authenticated) {
        return res.render("register");
    }
    return res.redirect("/");
});

router.get("/login", (req, res) => {
    if (!req.session.authenticated) {
        return res.render("login");
    }
    return res.redirect("/");
});

router.get("/logout", (req, res) => {
    if (req.session.authenticated) {
        req.session.authenticated = false;
        return res.redirect("/");
    }
    res.render("login", { message: "You are not logged in!" });
});

const validationRegister = [
    check("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),
    check("password")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters"),
    check("email").isEmail().withMessage("Please enter an email"),
];

const validatePost = [
    check("post_message")
        .isLength({ min: 1, max: 1000 })
        .withMessage(
            "Character must be at least 10 with a limit of 510 characters"
        ),
];

router.post("/create", validatePost, create_post);
router.post("/register", validationRegister, register);
router.post("/login", login);

module.exports = router;
