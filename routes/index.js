const { Router } = require("express");
const router = Router();
const { loginRequired } = require("../controllers/middleware/middleware");
const { query } = require("../controllers/dbCon");

router.get("/", loginRequired, async (req, res) => {
    let sql = `SELECT users.username, users.user_id, users.profile_image, posts.post_title, posts.post_file ,posts.post_content, posts.post_id, COUNT(DISTINCT likes.user_id) AS 'likes'
    FROM users INNER JOIN posts ON posts.user_id = users.user_id
    LEFT JOIN likes ON likes.post_id = posts.post_id GROUP BY posts.post_id;`;
    let posts = await query(sql);
    res.render("posts/home", {
        posts,
        user: req.session.user || "",
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        search: req.query.search || "",
    });
});

router.get("/search", loginRequired, async (req, res) => {
    let sql = `SELECT users.username, users.user_id, users.profile_image, posts.post_title, posts.post_content, posts.post_id, COUNT(DISTINCT likes.user_id) AS 'likes'
    FROM users INNER JOIN posts ON posts.user_id = users.user_id
    LEFT JOIN likes ON likes.post_id = posts.post_id
    WHERE users.username LIKE '%${req.query.search}%' OR posts.post_title LIKE '%${req.query.search}%' OR posts.post_content LIKE '%${req.query.search}%'
    GROUP BY posts.post_id`;

    let posts = await query(sql);

    res.render("posts/home", {
        posts,
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
        search: req.query.search || "",
    });
});

module.exports = router;
