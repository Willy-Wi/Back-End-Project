const { query } = require("../dbCon");

const postPerms = async (req, res, next) => {
    let sql = `SELECT user_id FROM posts WHERE post_id = ${req.params.id}`;
    let result = await query(sql);
    if (
        result.length < 1 ||
        !(result[0].user_id == req.params.user) ||
        !(req.session.user.user_id == req.params.user)
    ) {
        return res.redirect("/");
    }
    next();
};

const userPerms = async (req, res, next) => {
    if (!(req.session.user.user_id == req.params.user)) {
        return res.redirect("/");
    }
    next();
};

const commentPerms = async (req, res, next) => {
    let sql = `SELECT user_id FROM comments WHERE comment_id = ${req.params.id}`;
    let result = await query(sql);
    if (
        result.length < 1 ||
        !(result[0].user_id == req.params.user) ||
        !(req.session.user.user_id == req.params.user)
    ) {
        return res.redirect("/");
    }
    next();
};

const loginRequired = async (req, res, next) => {
    if (req.session.user) {
        let sql = `SELECT * FROM likes WHERE user_id = '${req.session.user.user_id}'`;
        req.likesInfo = await query(sql);
        sql = `SELECT * FROM following WHERE following_id = '${req.session.user.user_id}'`;
        req.followInfo = await query(sql);
    }
    next();
};

// Used For Register & Login
const isNotLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect("/");
    }
    next();
};

// Used For Any Authentication Required Page
const isLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/auth/login");
    }
    next();
};

module.exports = {
    loginRequired,
    commentPerms,
    userPerms,
    postPerms,
    isLoggedIn,
    isNotLoggedIn,
};
