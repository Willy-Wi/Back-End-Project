const { query } = require("../routes/dbFunctions");
const { validationResult } = require("express-validator");

const updatePostStats = {
    Like: function (postId, userId) {
        let sql = "INSERT INTO Likes SET ?";
        let data = { user_id: userId, post_id: postId };
        query(sql, data);
    },
    Dislike: function (postId, userId) {
        let sql = `DELETE FROM Likes WHERE user_id = '${userId}' AND post_id = '${postId}'`;
        query(sql);
    },
};

const postLike = (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect("/login");
    }

    const { user_id } = req.session.user;
    const { action } = req.body;
    const postId = req.params.id;
    updatePostStats[action](postId, user_id);
};

const postCreate = (req, res) => {
    if (!req.session.loggedIn) return res.redirect("/login");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render("create_post", {
            message: errors.array(),
            login: req.session.loggedIn,
        });
    }

    const { post_message } = req.body;
    const { user_id } = req.session.user;


    let sql = "INSERT INTO posts SET ?";

    let data = {
        user_id: user_id,
        post_text: post_message,
    };

    query(sql, data).then(() => res.redirect("/"));
};

module.exports = { postCreate, postLike };
