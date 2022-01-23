const { Router } = require('express');
const router = Router();
const { query } = require('../../../../controllers/dbCon');
const { editComment, deleteComment } = require("../../../../controllers/commentCon");
const { isLoggedIn, commentPerms } = require("../../../../controllers/middleware/middleware");

router.get("/edit/:id/:postId/:user", isLoggedIn, commentPerms, async (req, res) => {
    const { postId, id } = req.params;

    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_content, Posts.post_file , Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id`;

    let post = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Comments.comment_id,Comments.post_id ,Comments.comment_content FROM Users INNER JOIN Comments ON Users.user_id = Comments.user_id WHERE Comments.comment_id = '${id}'`;

    let comment = await query(sql);

    if (req.query.error) {
        return res.render("comments/editComment", {
            isLoggedIn: req.session.isLoggedIn || false,
            user: req.session.user || "",
            post: post[0],
            likes: req.likesInfo,
            comment: comment[0],
            error: req.query.error,
            id: req.params.id,
        });
    }

    res.render("comments/editComment", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        post: post[0],
        likes: req.likesInfo,
        comment: comment[0],
        id: req.params.id,
    });
});

router.put("/:id/:user", isLoggedIn, commentPerms, editComment);
router.delete("/:id/:user", commentPerms, deleteComment);

module.exports = router;
