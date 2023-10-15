const { query } = require("./dbCon");

const updatePostStats = {
    Like: function (postId, userId) {
        let sql = "INSERT INTO likes SET ?";
        let data = { user_id: userId, post_id: postId };
        query(sql, data);
    },
    Unlike: function (postId, userId) {
        let sql = `DELETE FROM likes WHERE user_id = '${userId}' AND post_id = '${postId}'`;
        query(sql);
    },
};

const likes = (req, res) => {
    const user_id = req.session.user.user_id;
    const { action } = req.body;
    const postId = req.params.id;
    updatePostStats[action](postId, user_id);
};

module.exports = { likes };
