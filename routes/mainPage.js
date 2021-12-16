const { query } = require("./dbFunctions");

const mainPage = async (req, res) => {
    let sql = `SELECT Users.username, Users.name, Posts.post_text, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id;`;

    let result = await query(sql);

    let likeStatus;

    if (req.session.loggedIn) {
        sql = `SELECT user_id, post_id FROM Likes WHERE user_id = '${req.session.user.user_id}'`;
        likeStatus = await query(sql);
    }

    if (!req.session.loggedIn) {
        return res.render("home", { result, loggedIn: req.session.loggedIn });
    }
    res.render("home", { result, loggedIn: req.session.loggedIn, likeStatus });
};

module.exports = { mainPage };
