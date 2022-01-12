const { query } = require("./dbCon");

const deletePost = async (req, res) => {
    const postId = req.params.id;

    let sql = `DELETE FROM posts WHERE post_id = ${postId}`;
    await query(sql);

    res.json({
        status: 200,
    });
};

module.exports = { deletePost };
