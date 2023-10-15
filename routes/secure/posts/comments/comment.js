const { Router } = require("express");
const router = Router();
const { query } = require("../../../../controllers/dbCon");
const {
    editComment,
    deleteComment,
} = require("../../../../controllers/commentCon");
const {
    isLoggedIn,
    commentPerms,
} = require("../../../../controllers/middleware/middleware");

router.get(
    "/edit/:id/:postId/:user",
    isLoggedIn,
    commentPerms,
    async (req, res) => {
        const { postId, id } = req.params;

        let sql = `SELECT users.username, users.user_id, users.profile_image, posts.post_title, posts.post_content, posts.post_file , posts.post_id, COUNT(likes.user_id) AS 'likes'
    FROM users INNER JOIN posts ON posts.user_id = users.user_id
    LEFT JOIN likes ON likes.post_id = posts.post_id
    WHERE posts.post_id = '${postId}' GROUP BY posts.post_id`;

        let post = await query(sql);

        sql = `SELECT users.username, users.user_id, comments.comment_id,comments.post_id ,comments.comment_content FROM users INNER JOIN comments ON users.user_id = comments.user_id WHERE comments.comment_id = '${id}'`;

        let comment = await query(sql);

        if (req.query.error) {
            return res.render("comments/editComment", {
                isLoggedIn: req.session.isLoggedIn || false,
                user: req.session.user || "",
                post: post[0],
                likes: req.likesInfo,
                comment: comment[0],
                error: req.query.error,
            });
        }

        res.render("comments/editComment", {
            isLoggedIn: req.session.isLoggedIn || false,
            user: req.session.user || "",
            post: post[0],
            likes: req.likesInfo,
            comment: comment[0],
        });
    }
);

router.put("/:id/:user", isLoggedIn, commentPerms, editComment);
router.delete("/:id/:user", commentPerms, deleteComment);

module.exports = router;
