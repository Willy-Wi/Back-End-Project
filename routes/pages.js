const { Router } = require("express");
const { query } = require("../controllers/dbCon");
const router = Router();
const { register, login } = require("../controllers/authCon");
const { likes } = require("../controllers/postCon");
const { follow } = require("../controllers/followCon");
const { createPost, createComment } = require("../controllers/createPost");

const loginRequired = async (req, res, next) => {
    if (req.session.user_id) {
        let sql = `SELECT * FROM likes WHERE user_id = '${req.session.user_id}'`;
        req.currentUser = await query(sql);
    }
    next();
};

router.get("/", loginRequired, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
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
    sql = `SELECT Users.username, Users.user_id, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id WHERE Users.user_id = '${req.params.id}' GROUP BY Posts.post_id`;
    let posts = await query(sql);

    sql = `SELECT U.username, U.name, U.user_id, COUNT(DISTINCT F.following_id) AS 'Followers', COUNT(DISTINCT P.post_id) AS 'Posts', COUNT(DISTINCT L.like_id) AS 'Likes'
    FROM Following F RIGHT JOIN Users U  ON F.user_id = U.user_id
    LEFT JOIN Posts P ON U.user_id = P.user_id
    LEFT JOIN Likes L ON P.post_id = L.post_id
    WHERE U.user_id = '${req.params.id}' GROUP BY U.user_id`;
    let stats = await query(sql);

    sql = `SELECT * FROM following WHERE following_id = '${req.session.user_id}'`;
    let follow = await query(sql);
    
    res.render("profile", {
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
        stats: stats[0],
        likes: req.currentUser,
        posts,
        follow,
    });
});

router.get("/posts/:id/", loginRequired, async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT Users.username, Users.user_id, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id`;

    let post = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Comments.comment_text FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Comments.post_id = '${postId}'`;

    let comments = await query(sql);

    if (req.query.error) {
        return res.render("comments", {
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.user_id,
            post: post[0],
            likes: req.currentUser,
            comments: comments,
            error: req.query.error,
        });
    }

    res.render("comments", {
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
        post: post[0],
        likes: req.currentUser,
        comments: comments,
    });
});

// For Register & Login
const isNotLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect("/");
    }
    next();
};

// Any Authentication Required Page
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
    req.session.destroy();
    res.redirect("/");
});

router.post("/register", isNotLoggedIn, register);
router.post("/login", isNotLoggedIn, login);
router.post("/posts/:id/act", isLoggedIn, likes);
router.post("/users/:id/act", isLoggedIn, follow);
router.post("/createpost", isLoggedIn, createPost);
router.post("/posts/:id/create_comment", isLoggedIn, createComment);

module.exports = router;
