const mysql2 = require("mysql2");

const conn = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "willywijaya5520",
    database: "popsicle",
});

const query = (sql, data = null) => {
    return new Promise((resolve, reject) => {
        conn.query(sql, data, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
}

module.exports = { conn, query };
