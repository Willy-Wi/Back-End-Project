const { query } = require("./dbCon");

const createComment = (req, res) => {
    const postId = req.params.id;
    const { comment } = req.body;
    let errReply;

    if (!(comment.length >= 5 && comment.length <= 1000)) {
        errReply = encodeURIComponent(
            "Comment length must be between 5 and 1000 characters"
        );
    }

    if (errReply) {
        return res.redirect("/posts/" + postId + "/?error=" + errReply);
    } else {
        let sql = "INSERT INTO comments SET ?";
        let data = {
            user_id: req.session.user.user_id,
            post_id: postId,
            comment_content: comment,
        };
        query(sql, data);
        res.redirect("/posts/" + postId);
    }
};

const deleteComment = (req, res) => {
    const commentId = req.params.id;
    let sql = `DELETE FROM comments WHERE comment_id = '${commentId}'`;
    query(sql);
    res.end();
};

const editComment = async (req, res) => {
    const { edit_comment, postId } = req.body;
    const commentId = req.params.id;
    let sql = `UPDATE comments SET comment_content = '${edit_comment}' WHERE comment_id = '${commentId}'`;

    await query(sql);

    res.json({ redirect: "/posts/" + postId });
};

module.exports = { deleteComment, editComment, createComment };
