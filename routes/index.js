const { Router } = require("express");
const router = Router();
const { loginRequired } = require("../controllers/middleware/middleware");
const { query } = require("../controllers/dbCon");

router.get("/", loginRequired, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file ,Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id;`;
    let posts = await query(sql);
    res.render("posts/home", {
        posts,
        user: req.session.user || "",
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        search: req.query.search,
    });
});

router.get("/search", loginRequired, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Users.username LIKE '%${req.query.search}%' OR Posts.post_title LIKE '%${req.query.search}%' OR Posts.post_content LIKE '%${req.query.search}%'
    GROUP BY Posts.post_id`;

    let posts = await query(sql);

    res.render("posts/home", {
        posts,
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
        search: req.query.search,
    });
});

module.exports = router;
