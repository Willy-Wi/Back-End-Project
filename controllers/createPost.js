const { query } = require("./dbCon")

const createPost = (req, res) => {
    const { title, description } = req.body;
    let sql = `INSERT INTO posts SET ?`;
    let data = {
        user_id: req.session.user_id,
        post_title: title,
        post_text: description
    }
    query(sql, data);
    
    res.redirect("/");
}

module.exports = { createPost }