const { Router } = require("express");
const router = Router();
const { query } = require("../../../controllers/dbCon");
const { likes } = require("../../../controllers/likeCon");
const {
    createPost,
    editPost,
    deletePost,
} = require("../../../controllers/postCon");
const { createComment } = require("../../../controllers/commentCon");
const {
    isLoggedIn,
    postPerms,
    loginRequired,
} = require("../../../controllers/middleware/middleware");
const { createReport } = require("../../../controllers/report_feedbackCon");

router.get("/create", isLoggedIn, (req, res) => {
    res.render("posts/createPost", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
    });
});

router.get("/:id", loginRequired, async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT users.username, users.user_id, users.profile_image, posts.post_title, posts.post_file ,posts.post_content, posts.post_id, COUNT(DISTINCT likes.user_id) AS 'likes'
    FROM users INNER JOIN posts ON posts.user_id = users.user_id
    LEFT JOIN likes ON likes.post_id = posts.post_id
    WHERE posts.post_id = '${postId}' GROUP BY posts.post_id`;
    let post = await query(sql);

    sql = `SELECT users.username, users.user_id, comments.comment_id, comments.post_id, comments.comment_content FROM users INNER JOIN comments ON
    users.user_id = comments.user_id WHERE comments.post_id = '${postId}'`;
    let comments = await query(sql);

    if (req.query.error) {
        return res.render("comments/comments", {
            user: req.session.user || "",
            isLoggedIn: req.session.isLoggedIn || false,
            post: post[0],
            likes: req.likesInfo,
            comments: comments,
            error: req.query.error,
        });
    }
    res.render("comments/comments", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        post: post[0],
        likes: req.likesInfo,
        comments: comments,
    });
});

router.get("/:id/:user/edit", isLoggedIn, postPerms, async (req, res) => {
    let sql = `SELECT users.user_id, posts.post_title, posts.post_file,posts.post_content, posts.post_id
    FROM users INNER JOIN posts ON posts.user_id = users.user_id WHERE post_id = '${req.params.id}'`;

    let result = await query(sql);

    res.render("posts/editPost", {
        data: result[0],
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
    });
});

router.get("/report/:id", async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT users.username, users.user_id, users.profile_image, posts.post_title,posts.post_file , posts.post_content, posts.post_id, COUNT(likes.user_id) AS 'likes'
    FROM users INNER JOIN posts ON posts.user_id = users.user_id
    LEFT JOIN likes ON likes.post_id = posts.post_id GROUP BY posts.post_id;`;

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

router.post("/create", isLoggedIn, createPost);
router.put("/:id/:user/edit", isLoggedIn, postPerms, editPost);
router.delete("/:id/:user", postPerms, deletePost);
router.post("/:id/act", isLoggedIn, likes);

router.post("/:id/create_comment", isLoggedIn, createComment);
router.post("/report/:id2", isLoggedIn, createReport);

module.exports = router;
