const { query } = require("./dbCon");

const deletepost = async(req, res) => {
    const postid = req.params.id;
    let sql = "DELETE FROM posts WHERE post_id=" + postid;
    await query(sql);
    res.json({
        status: 200,
    });
};

module.exports = { deletepost };
