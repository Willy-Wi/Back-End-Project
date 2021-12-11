const { Router } = require("express");
const bcrypt = require("bcrypt");
const mysql2 = require("mysql2");
const { register, login, logout } = require("../controllers/authCon");

const router = Router();

const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test_db_home",
});

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/register", (req, res) => {
    res.render("register", { message: null });
});

router.get("/login", (req, res) => {
    res.render("login", { message: null });
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
