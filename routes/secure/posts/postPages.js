const { Router } = require("express");
const router = Router();
const { query } = require("../../../controllers/dbCon");
const {
    isLoggedIn,
    loginRequired,
} = require("../../../controllers/middleware/middleware");

router.get("/featured-post", loginRequired, async (req, res) => {
    let sql = `SELECT users.username, users.user_id, users.profile_image, posts.post_title, posts.post_file , posts.post_content, posts.post_id, COUNT(likes.user_id) AS 'likes'
    FROM users INNER JOIN posts ON posts.user_id = users.user_id
    LEFT JOIN likes ON likes.post_id = posts.post_id GROUP BY posts.post_id ORDER BY likes DESC LIMIT 5;`;

    let posts = await query(sql);

    res.render("posts/featured-post", {
        posts,
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
    });
});

router.get("/mytopics", isLoggedIn, loginRequired, async (req, res) => {
    let sql = `SELECT users.username, users.user_id, users.profile_image, posts.post_title, posts.post_file ,posts.post_content, posts.post_id, COUNT(likes.user_id) AS 'likes'
    FROM users INNER JOIN posts ON posts.user_id = users.user_id
    LEFT JOIN likes ON likes.post_id = posts.post_id WHERE users.user_id = '${req.session.user.user_id}' GROUP BY posts.post_id;`;

    let posts = await query(sql);

    res.render("posts/mytopics", {
        posts,
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
    });
});

router.get("/myanswers", isLoggedIn, async (req, res) => {
    sql = `SELECT users.username, users.user_id, comments.comment_id, comments.post_id, comments.comment_content FROM users INNER JOIN comments ON
    users.user_id = comments.user_id WHERE users.user_id = '${req.session.user.user_id}' ORDER BY comments.created_at DESC`;
    let comments = await query(sql);

    res.render("posts/myanswers", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        comments: comments,
        error: req.query.error || "",
    });
});

module.exports = router;
