const { query } = require("../controllers/dbCon");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    const { username, name, email, password, confirmPassword } = req.body;
    const regex = /[^A-Za-z0-9_]/g;
    let errUser, errEmail, errPass;
    // Check Duplication
    let sql = `SELECT email, username FROM users WHERE BINARY email = '${email}' OR username = '@${username}'`;
    const result = await query(sql);

    // Form Validation Check
    if (username.match(regex)) {
        errUser = "Username can only contain numbers, letters, and underscores";
    } else if (username.length < 5) {
        errUser = "Username must be at least 5 characters long";
    } else if (result.length > 0 && result[0].username) {
        errUser = "That username already exists";
    }

    if (email.length < 5) {
        errEmail = "Username must be at least 5 characters long";
    } else if (result.length > 0 && result[0].email) {
        errEmail = "That email is already registered";
    }

    if (password.length < 5) {
        errPass = "Password must be at least 5 characters long";
    }

    const errPassMatch =
        password !== confirmPassword ? "Password does not match" : null;

    if (errUser || errEmail || errPass || errPassMatch) {
        return res.render("register", {
            errUser,
            errEmail,
            errPass,
            errPassMatch,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    sql = `INSERT INTO users SET ?`;
    let data = {
        username: `@${username}`,
        name: name,
        email: email,
        password: hashedPassword,
        profile_image: 0
    };

    query(sql, data);
    res.redirect("/login");
};

const login = async (req, res) => {
    const { email, password } = req.body;
    let sql = `SELECT password, user_id, profile_image FROM users WHERE BINARY email = '${email}'`;
    let result = await query(sql);
    let invalidEmail = "That user does not exist";
    let invalidPassword = "Invalid Password";
    if (result.length < 1) {
        return res.render("login", { invalidEmail });
    }
    let checkPass = await bcrypt.compare(password, result[0].password);
    if (!checkPass) {
        return res.render("login", { invalidPassword });
    }

    req.session.isLoggedIn = true;
    req.session.user_id = result[0].user_id;
    req.session.pfp = result[0].profile_image;
    res.redirect("/");
};

module.exports = { login, register };
