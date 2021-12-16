const { query } = require("../routes/dbFunctions");

const searchData = async (req, res) => {
    const search = req.query.search;
    if (search < 1) return res.redirect("/");

    let sql = `SELECT Users.username, Users.name, Posts.post_text, Posts.post_id
    FROM Users INNER JOIN Posts ON Users.user_id = Posts.user_id
    WHERE Users.username LIKE '%${search}%' OR
    Users.name LIKE '%${search}%' OR
    Posts.post_text LIKE '%${search}%'`;

    await query(sql);

    if (!req.session.loggedIn) {
        return res.render("home", { result, loggedIn: req.session.loggedIn });
    }

    res.render("home", { result, loggedIn: req.session.loggedIn });
};

module.exports = { searchData };
