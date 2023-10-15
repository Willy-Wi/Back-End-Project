require("dotenv").config({ path: __dirname + "/.env" });
const mysql2 = require("mysql2");

const conn = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: process.env.DB_PORT,
});

function query(sql, data = null) {
    return new Promise((resolve, reject) => {
        conn.query(sql, data, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

module.exports = { conn, query };
