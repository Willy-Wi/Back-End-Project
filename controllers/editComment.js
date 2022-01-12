const { query } = require("./dbCon");
//Delete Comment
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

module.exports = { deleteComment, editComment };
