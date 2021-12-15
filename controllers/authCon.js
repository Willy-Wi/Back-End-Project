const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { conn } = require("../routes/database_conn");
// const isEligibleRequest = require("express-fileupload/lib/isEligibleRequest");

function query(sql, data) {
    return new Promise((resolve, reject) => {
        conn.query(sql, data, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const create_post = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("create_post", {
            message: errors.array(),
            login: true,
        });
    }

    const { post_message } = req.body;
    const { user_id } = req.session.user;

    if (!req.session.authenticated) return res.render("login");

    let sql = "INSERT INTO posts SET ?";

    let data = {
        user_id: user_id,
        post_text: post_message,
    };

    query(sql, data).then(() => res.redirect("/"));

};

const register = async (req, res) => {
    const errors = validationResult(req);
    const { username, fullname, email, password, confirmPassword } = req.body;
    let sql = `SELECT email, username FROM users WHERE BINARY email = '${email}' OR username = '${username}'`;

    let regex = /[^A-Za-z0-9_]/g;

    // Querying to see if the data already exists or not
    let query = await new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    });

    // Validating Data
    if (!errors.isEmpty() || query.length > 0) {
        let error = errors.array();
        let errorUsername, errorEmail, errorPassword, invalidPasswordMatch;
        items = {}

        for (let i of error) {
            items[i.param] = i.msg;
        };

        if (items.username) {
            errorUsername = items.username;
        } else if (username.match(regex)) {
            errorUsername =
                "Username can only have numbers, letters, and underscores";
        } else if (query.length > 0 && query[0].username) {
            errorUsername = "That username already exist!";
        }

        if (items.email) {
            errorEmail = items.email;
        } else if (query.length > 0 && query[0].email) {
            errorEmail = "That email is already registered";
        }

        if (items.password) {
            errorPassword = items.password;
        }

        // Checking if Password is equal to Confirm Password Field
        if (password !== confirmPassword) {
            invalidPasswordMatch = "Password does not match!";
        }

        return res.render("register", {
            errorUsername,
            errorEmail,
            errorPassword,
            invalidPasswordMatch,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Crypting Password

    sql = "INSERT INTO users SET ?";
    let data = {
        username: `@${username}`,
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
    const { email, password } = req.body;

    let sql = "SELECT password, user_id FROM users WHERE BINARY email = ?";

    let query = await new Promise((resolve, reject) => {
        conn.query(sql, email, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    });

    if (query.length < 1) {
        return res.render("login", {
            invalidEmail: "That user does not exist!",
        });
    }

    const qPassword = query[0].password;
    const qUserID = query[0].user_id;

    let checkPassword = await bcrypt.compare(password, qPassword);

    if (!checkPassword)
        return res.render("login", { invalidPassword: "Invalid Password!" });

    if (!req.session.authenticated) {
        req.session.authenticated = true;
        req.session.user = {
            user_id: qUserID,
        };
        return res.redirect("/");
    }
};

module.exports = { register, login, create_post };
