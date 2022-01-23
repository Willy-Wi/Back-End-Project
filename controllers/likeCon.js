const { query } = require("./dbCon");

const updatePostStats = {
    Like: function (postId, userId) {
        let sql = "INSERT INTO Likes SET ?";
        let data = { user_id: userId, post_id: postId };
        query(sql, data);
    },
    Unlike: function (postId, userId) {
        let sql = `DELETE FROM Likes WHERE user_id = '${userId}' AND post_id = '${postId}'`;
        query(sql);
    },
};

const likes = (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    const user_id = req.session.user.user_id;
    const { action } = req.body;
    const postId = req.params.id;
    updatePostStats[action](postId, user_id);
};

module.exports = { likes }