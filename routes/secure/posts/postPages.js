const { Router } = require("express");
const router = Router();
const { query } = require("../../../controllers/dbCon");
const {
    isNotLoggedIn,
    isLoggedIn,
} = require("../../../controllers/middleware/middleware");

router.get("/featured-post", isNotLoggedIn, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file , Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id ORDER BY COUNT(Likes.post_id) DESC LIMIT 5;`;

    let posts = await query(sql);

    res.render("posts/featured-post", {
        posts,
        post: posts[0],
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
    });
});

router.get("/mytopics", isLoggedIn, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file ,Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id WHERE Users.user_id = '${req.session.user.user_id}' GROUP BY Posts.post_id;`;

    let posts = await query(sql);

    res.render("posts/mytopics", {
        posts,
        post: posts[0],
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
    });
});

router.get("/myanswers", isLoggedIn, async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file ,Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id`;

    let post = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Comments.comment_content FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Users.user_id = '${req.session.user.user_id}' ORDER BY Comments.created_at DESC`;

    let comments = await query(sql);

    if (req.query.error) {
        return res.render("posts/myanswers", {
            isLoggedIn: req.session.isLoggedIn || false,
            user: req.session.user || "",
            post: post[0],
            likes: req.likesInfo,
            comments: comments,
            error: req.query.error,
        });
    }

    res.render("posts/myanswers", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        post: post[0],
        likes: req.likesInfo,
        comments: comments,
    });
});

module.exports = router;
