const mysql2 = require("mysql2");

const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "willywijaya5520",
    database: "popsicle",
});

module.exports = { conn };
