const { Router } = require('express');
const router = Router();
const { query } = require('../../../controllers/dbCon');
const { likes } = require("../../../controllers/likeCon");
const { createPost, editPost, deletePost } = require("../../../controllers/postCon");
const { createComment } = require("../../../controllers/commentCon");
const { isLoggedIn, postPerms, loginRequired } = require("../../../controllers/middleware/middleware");
const { createReport } = require("../../../controllers/report_feedbackCon");

router.get("/create", isLoggedIn, (req, res) => {
    res.render("posts/createPost", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
    });
});

router.get("/:id", loginRequired, async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file ,Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id`;
    let post = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Comments.comment_id, Comments.post_id, Comments.comment_content FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Comments.post_id = '${postId}'`;
    let comments = await query(sql);

    if (req.query.error) {
        return res.render("comments/comments", {
            user: req.session.user || "",
            isLoggedIn: req.session.isLoggedIn || false,
            post: post[0],
            likes: req.likesInfo,
            comments: comments,
            error: req.query.error,
            id: req.params.id,
        });
    }
    res.render("comments/comments", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        post: post[0],
        likes: req.likesInfo,
        comments: comments,
        id: req.params.id,
    });
});

router.get("/:id/:user/edit", isLoggedIn, postPerms, async (req, res) => {
    let sql = `SELECT Users.user_id, Posts.post_title, Posts.post_file,Posts.post_content, Posts.post_id
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id WHERE post_id = '${req.params.id}'`;

    let result = await query(sql);

    res.render("posts/editPost", {
        data: result[0],
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
    });
}
);

router.get("/report/:id", async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title,Posts.post_file , Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id;`;

    let posts = await query(sql);

    res.render("posts/reportPost", {
        posts,
        post: posts[0],
        id: postId,
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
    });
});

router.post("/:id/create_comment", isLoggedIn, createComment);
router.post("/:id/act", isLoggedIn, likes);
router.post("/create", isLoggedIn, createPost);
router.put("/:id/:user/edit", isLoggedIn, postPerms, editPost);
router.delete("/:id/:user", postPerms, deletePost);
router.post("/posts/report/:id2", isLoggedIn, createReport);

module.exports = router;
