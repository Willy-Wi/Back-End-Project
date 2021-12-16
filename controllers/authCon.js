const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { query } = require("../routes/dbFunctions");
// const isEligibleRequest = require("express-fileupload/lib/isEligibleRequest");

// * Register HTTP Post
const register = async (req, res) => {
    const errors = validationResult(req);
    const { username, fullname, email, password, confirmPassword } = req.body;
    let sql = `SELECT email, username FROM users WHERE BINARY email = '${email}' OR username = '@${username}'`;

    let errUser, errEmail;
    let regex = /[^A-Za-z0-9_]/g;
    let result = await query(sql);
    let resultValue = result.length > 0;
    let items = {};

    // Validating Data
    if (!errors.isEmpty() || resultValue) {
        for (let i of errors.array()) {
            items[i.param] = i.msg;
        }

        const {
            username: invalidUser,
            email: invalidEmail,
            password: invalidPass,
        } = items;

        if (invalidUser) {
            errUser = invalidUser;
        } else if (username.match(regex)) {
            errUser =
                "Username can only contain numbers, letters, and underscores";
        } else if (resultValue && result[0].username) {
            errUser = "That username already exist!";
        }

        console.log(errUser);

        if (invalidEmail) {
            errEmail = invalidEmail;
        } else if (resultValue && result[0].email) {
            errEmail = "That email is already registered";
        }

        let errPass = invalidPass ? invalidPass : null;

        // Checking if Password is equal to Confirm Password Field
        let errPassMatch =
            password !== confirmPassword ? "Password does not match!" : null;

        return res.render("register", {
            errUser,
            errEmail,
            errPass,
            errPassMatch,
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

    await query(sql, data);

    res.redirect("/login");
};

// * Login HTTP Post
const login = async (req, res) => {
    const { email, password } = req.body;

    let sql = "SELECT password, user_id FROM users WHERE BINARY email = ?";

    let result = await query(sql, email);

    if (result.length < 1) {
        return res.render("login", {
            invalidEmail: "That user does not exist!",
        });
    }

    let checkPassword = await bcrypt.compare(password, result[0].password);

    if (!checkPassword)
        return res.render("login", { invalidPassword: "Invalid Password!" });

    if (!req.session.loggedIn) {
        req.session.loggedIn = true;
        req.session.user = {
            user_id: result[0].user_id,
        };
        return res.redirect("/");
    }
};

module.exports = { register, login };
