const { query } = require("./dbCon");
//Delete Comment
const deleteComment = (req, res) => {
    const deleteId = req.params.id
    let sql = `delete from comments where comment_id = `+deleteId;
    query(sql);
    res.end();
}

const editComment = async (req, res) => {
    const { edit_comment } = req.body;
    const commentId = req.params.id;
    let sql = `UPDATE comments SET comment_text = '${edit_comment}' WHERE comment_id= `+ commentId;
        await query(sql);
};

module.exports = { deleteComment , editComment}; 