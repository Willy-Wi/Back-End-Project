const { query } = require("./dbCon")

const createPost = (req, res) => {
    const { title, description } = req.body;
    let sql = `INSERT INTO posts SET ?`;
    let data = {
        user_id: req.session.user_id,
        post_title: title,
        post_content: description
    }
    query(sql, data);
    
    res.redirect("/");
}

const createComment = (req, res) => {
    const postId = req.params.id;
    const { comment } = req.body;
    let sql = 'INSERT INTO comments SET ?';
    let data = {
        user_id: req.session.user_id,
        post_id: postId,
        comment_text: comment,
    }
    query(sql, data);
    res.redirect("/");
}

module.exports = { createPost, createComment }