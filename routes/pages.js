const { Router } = require("express");
const { query } = require("../controllers/dbCon");
const router = Router();
const { register, login } = require("../controllers/authCon");
const { likes } = require("../controllers/postCon");
const { createPost } = require("../controllers/createPost");

const loginRequired = async (req, res, next) => {
    if (req.session.user_id) {
        let sql = `SELECT * FROM likes WHERE user_id = '${req.session.user_id}'`;
        req.currentUser = await query(sql);
    }
    next();
};

router.get("/", loginRequired, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Posts.post_title, Posts.post_text, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id;`;

    let posts = await query(sql);
    res.render("home", {
        posts,
        isLoggedIn: req.session.isLoggedIn,
        likes: req.currentUser,
        user_id: req.session.user_id,
    });
});

router.get("/users/:id", loginRequired, async (req, res) => {
    let sql = `SELECT name, username FROM users WHERE user_id = '${req.params.id}'`;
    let user = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Posts.post_title, Posts.post_text, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id WHERE Users.user_id = '${req.params.id}' GROUP BY Posts.post_id`;
    let posts = await query(sql);

    sql = `SELECT Users.user_id, COUNT(Likes.like_id) AS 'Likes' , COUNT(Posts.post_id) AS 'Posts' FROM Users INNER JOIN Posts ON Users.user_id = Posts.user_id
    INNER JOIN Likes ON Likes.post_id = Posts.post_id WHERE Users.user_id = '${req.params.id}' GROUP BY Users.user_id`;

    let stats = await query(sql);

    res.render("profile", {
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
        user: user[0],
        posts: posts,
        stats: stats[0],
        likes: req.currentUser,
    });
});

router.get("/posts/:id", async (req, res) => {
    const postId = req.params.id;

    let sql =
    `SELECT Users.username, Users.user_id, Posts.post_title, Posts.post_text, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id;`;

    let post = await query(sql);

    sql =
    `SELECT Users.username, Users.user_id, Comments.comment_text FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Comments.post_id = '${postId}'`;

    let comments = await query(sql);

    res.render("comments", {
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
    });
})

const isNotLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect("/");
    }
    next();
};

const isLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    next();
};

router.get("/createpost", isLoggedIn, (req, res) => {
    res.render("createPost", {
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
    });
});

router.get("/register", isNotLoggedIn, (req, res) => {
    res.render("register");
});

router.get("/login", isNotLoggedIn, (req, res) => {
    res.render("login");
});

router.get("/logout", (req, res) => {
    req.session.isLoggedIn = false;
    req.session.user_id = null;
    res.redirect("/");
});

router.post("/register", isNotLoggedIn, register);
router.post("/login", isNotLoggedIn, login);
router.post("/posts/:id/act", isLoggedIn, likes);
router.post("/createpost", isLoggedIn, createPost);

module.exports = router;
