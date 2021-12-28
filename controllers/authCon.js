const { query } = require("../controllers/dbCon");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    const { username, name, email, password, confirmPassword } = req.body;
    const regex = /[^A-Za-z0-9_]/g;
    let errUser, errEmail, errPass;
    let sql = `SELECT email, username FROM users WHERE BINARY email = '${email}' OR username = '@${username}'`;
    const result = await query(sql);

    if (username.match(regex)) {
        errUser = "Username can only contain numbers, letters, and underscores";
    } else if (username.length < 5) {
        errUser = "Username must be at least 5 characters long";
    } else if (result.length > 0 && result[0].username) {
        errUser = "That username already exists";
    }

    if (email.length < 5) {
        errEmail = "Email must be at least 5 characters long";
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
    };

    query(sql, data);
    res.redirect("/login");
};

const login = async (req, res) => {
    const { email, password } = req.body;
    let sql = `SELECT password, user_id FROM users WHERE email = '${email}'`;
    let result = await query(sql);
    sql = `SELECT profile FROM users WHERE user_id = '${result[0].user_id}'`;
    let result2 = await query(sql);
    let invalidEmail = "That user does not exist";
    let invalidPassword = "Invalid Password";
    // console.log(email);
    // console.log(sql);
    // console.log(result);
    if (result.length < 1) {
        return res.render("login", { invalidEmail });
    }
    let checkPass = await bcrypt.compare(password, result[0].password);
    if (!checkPass) {
        return res.render("login", { invalidPassword });
    }

    req.session.isLoggedIn = true;
    req.session.user_id = result[0].user_id;
    req.session.profile_url = result2[0].profile;
    res.redirect("/");
};

const forgot = async (req, res, next) => {
    const { email, username } = req.body;
    const regex = /[^A-Za-z0-9_]/g;
    let errUser, errEmail;
    let sql = `SELECT password, user_id FROM users WHERE email = '${email}' AND username = '@${username}'`;
    let result = await query(sql);
    let invalidCheck = "That user does not exist. Please check again your username or email.";

    if (username.match(regex)) {
        errUser = "Username can only contain numbers, letters, and underscores";
    } else if (username.length < 5) {
        errUser = "Username must be at least 5 characters long";
    }

    if (email.length < 5) {
        errEmail = "Email must be at least 5 characters long";
    }

    if (errUser || errEmail) {
        return res.render("forgot-password", {
            errUser,
            errEmail
        });
    }

    if(result.length < 1) {
        return res.render("forgot-password", { invalidCheck });
    }

    const userid = result[0].user_id;

    res.render('change-password', {
        userid: userid,
    });
};

const change = async (req, res) => {
    const { userid,  password, confirmPassword } = req.body;
    let errPass;
    if (password.length < 5) {
        errPass = "Password must be at least 5 characters long";
    }
    const errPassMatch =
        password !== confirmPassword ? "Password does not match" : null;


    if (errPass || errPassMatch) {
        return res.render("change-password", {
            userid,
            errPass,
            errPassMatch,
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let sql = "UPDATE users SET password ='" + hashedPassword +
        "' WHERE user_id=" + userid;

    await query(sql);

    console.log("Password baru telah menggantikan password lama!");
    res.redirect("/login");

};

module.exports = { login, register, forgot, change };
