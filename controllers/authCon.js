const mysql2 = require("mysql2");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
// const isEligibleRequest = require("express-fileupload/lib/isEligibleRequest");

const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_db_home",
});

const create_post = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("create_post", { error: errors.array(), login: true });
    }

    const { post_message } = req.body;
    const { user_id, username, name } = req.session.user;

    if (!req.session.authenticated) return res.render("login");

    let sql = "INSERT INTO posts SET ?";

    let data = {
        user_id: user_id,
        username: username,
        name: name,
        post_content: post_message,
    };

    conn.query(sql, data, (err, result) => {
        if (err) throw err;

        res.redirect("/");
    });
};

const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("register", { error: errors.array() });
    }

    const { username, fullname, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render("register", {
            message: "Password does not match!",
        });
    }

    let sql = `SELECT email, username FROM users WHERE email = '${email}' OR username = '${username}'`;

    let query = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    });

    if (query.length > 0) {
        if (query[0].email) {
            return res.render("register", {
                message: "That email is already registered!",
            });
        } else if (query[0].password) {
            return res.render("register", {
                message: "That username already exist!",
            });
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    sql = "INSERT INTO users SET ?";
    let data = {
        username: username,
        name: fullname,
        email: email,
        password: hashedPassword,
    };

    conn.query(sql, data, (err, result) => {
        if (err) throw err;
    });
    res.render("login");
};

const login = async (req, res) => {
    const { username, password } = req.body;

    let sql = "SELECT * FROM users WHERE BINARY username = ?";

    let query = await new Promise((resolve, reject) => {
        conn.query(sql, username, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    });

    if (query.length < 1) {
        return res.render("login", {
            invalidUser: "That user does not exist!",
        });
    }

    const qPassword = query[0].password;
    const qUserID = query[0].user_id;
    const qUserName = query[0].username;
    const qFullName = query[0].name;

    let checkPassword = await bcrypt.compare(password, qPassword);

    if (!checkPassword)
        return res.render("login", { invalidPassword: "Invalid Password!" });

    if (!req.session.authenticated) {
        req.session.authenticated = true;
        req.session.user = {
            user_id: qUserID,
            username: qUserName,
            name: qFullName };
        return res.redirect("/");
    }

    res.render("login", { message: "You're already logged in!" });
};

module.exports = { register, login, create_post };
