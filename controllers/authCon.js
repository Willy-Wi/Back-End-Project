const mysql2 = require("mysql2");
const bcrypt = require("bcrypt");

const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_db_home",
});

const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render("register", { message: "Password does not match!" });
    }

    let sql = "SELECT email FROM users WHERE email = ?";

    let query = await new Promise((resolve, reject) => {
        conn.query(sql, email, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    });

    if (query.length > 0) {
        return res.render("register", {
            message: "That email is already registered!",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    sql = "INSERT INTO users SET ?";
    let data = {
        username: username,
        email: email,
        password: hashedPassword,
    };

    conn.query(sql, data, (err, res) => {
        if (err) throw err;

        res.render("register", { message: "Successfully registered" });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;

    res.json({ message: "success" });
};

const logout = (req, res) => {};

module.exports = { register, login, logout };
