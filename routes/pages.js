const { Router } = require("express");
const { query } = require("../controllers/dbCon");
const router = Router();
const { register, login, forgot, change } = require("../controllers/authCon");
const { likes } = require("../controllers/postCon");
const { createPost, createComment } = require("../controllers/createPost");
const { follow, editUser } = require("../controllers/userCon");
const {
    createPost,
    createComment,
    createReport,
    createFeedback,
} = require("../controllers/createPost");
const { createAlbum } = require("../controllers/createAlbum");
const { uploadFiles } = require("../controllers/filesCon");
const { updatepost } = require("../controllers/updatePost");
const { deletepost } = require("../controllers/deletePost");
const { deleteComment, editComment } = require("../controllers/editComment");

// Additional query only if the user is logged in and approved
const loginRequired = async (req, res, next) => {
    if (req.session.user_id) {
        let sql = `SELECT * FROM likes WHERE user_id = '${req.session.user_id}'`;
        req.currentUser = await query(sql);
    }
    next();
};

router.get("/", loginRequired, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id;`;

    let posts = await query(sql);

    res.render("home", {
        posts,
        post: posts[0],
        isLoggedIn: req.session.isLoggedIn,
        profile_image: req.session.pfp,
        likes: req.currentUser,
        user_id: req.session.user_id,
        image: req.session.profile_url,
    });
});

router.get("/users/:id", loginRequired, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id WHERE Users.user_id = '${req.params.id}' GROUP BY Posts.post_id`;
    let posts = await query(sql);

    // sql = `SELECT U.username, U.name, U.user_id, U.profile_image, COUNT(DISTINCT F.following_id) AS 'Followers', COUNT(DISTINCT P.post_id) AS 'Posts', COUNT(DISTINCT L.like_id) AS 'Likes'
    // FROM Following F RIGHT JOIN Users U  ON F.user_id = U.user_id
    // LEFT JOIN Posts P ON U.user_id = P.user_id
    // LEFT JOIN Likes L ON P.post_id = L.post_id
    // WHERE U.user_id = '${req.params.id}' GROUP BY U.user_id`

    sql = `SELECT album_id, album_name, album_cover, album_description, album_date, user_id, username FROM albums WHERE user_id = '${req.params.id}'`;
    let albums = await query(sql);

    sql = `SELECT Users.user_id, COUNT(following.following_id) AS 'Followers', COUNT(Likes.like_id) AS 'Likes' , COUNT(Posts.post_id) AS 'Posts'
    FROM Following RIGHT JOIN Users ON Users.user_id = Following.user_id
    LEFT JOIN Posts ON Users.user_id = Posts.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Users.user_id = '${req.params.id}' GROUP BY Users.user_id`;
    let stats = await query(sql);

    sql = `SELECT * FROM following WHERE following_id = '${req.session.user_id}'`;
    let follow = await query(sql);

    res.render("profile", {
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
        user: user[0],
        posts: posts,
        users: user,
        stats: stats[0],
        likes: req.currentUser,
        follow,
        albums: albums,
        image: req.session.profile_url,
        id: req.params.id,
    });
});

router.get("/users/:id/edit", isLoggedIn, async (req, res) => {
    let sql = `SELECT name, username, user_id, email FROM users WHERE user_id = '${req.params.id}'`;
    let user = await query(sql);

    res.render("edit", {
        isLoggedIn: req.session.isLoggedIn,
        profile_image: req.session.pfp,
        user_id: req.session.user_id,
        user: user[0],
    });
});

router.get("/posts/:id/", async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id`;

    let post = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Comments.comment_id, Comments.comment_content FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Comments.post_id = '${postId}'`;

    let comments = await query(sql);

    if (req.query.error) {
        return res.render("comments", {
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.user_id,
            post: post[0],
            profile_image: req.session.pfp,
            likes: req.currentUser,
            comments: comments,
            error: req.query.error,
            image: req.session.profile_url,
            id: req.params.id,
        });
    }

    res.render("comments", {
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
        post: post[0],
        likes: req.currentUser,
        profile_image: req.session.pfp,
        comments: comments,
        image: req.session.profile_url,
        id: req.params.id,
    });
});

router.get("/album/:id", async (req, res) => {
    const albumid = req.params.id;

    let sql = `SELECT file_id, album_id, file_url, file_type, thumb_url FROM files WHERE album_id = '${albumid}' ORDER BY created_at DESC`;
    let files = await query(sql);

    sql = `SELECT name, username, user_id, email, profile FROM users WHERE user_id = '${req.params.id}'`;
    let user = await query(sql);

    sql = `SELECT album_name, album_cover, album_description FROM albums WHERE album_id = '${albumid}'`;
    let album = await query(sql);

    res.render("addfiles", {
        albumid: albumid,
        album: album[0],
        files: files,
        file: files[0],
        isLoggedIn: req.session.isLoggedIn,
        user: user[0],
        image: req.session.profile_url,
        user_id: req.session.user_id,
        profile_url: req.session.profile_url,
    });
});

router.get("/reportpost/:id", async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT Users.username, Users.user_id, Users.profile, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id;`;

    let posts = await query(sql);

    res.render("reportPost", {
        posts,
        post: posts[0],
        id: postId,
        isLoggedIn: req.session.isLoggedIn,
        likes: req.currentUser,
        user_id: req.session.user_id,
        image: req.session.profile_url,
    });
});

router.get("/search", loginRequired, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Users.username LIKE '%${req.query.search}%' OR Posts.post_title LIKE '%${req.query.search}%' OR Posts.post_content LIKE '%${req.query.search}%'
    GROUP BY Posts.post_id`;

    let posts = await query(sql);

    res.render("home", {
        posts,
        isLoggedIn: req.session.isLoggedIn,
        profile_image: req.session.pfp,
        likes: req.currentUser,
        user_id: req.session.user_id,
    });
});

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
        return res.redirect("/login");
    }
    next();
};

router.get("/featured-post", isNotLoggedIn, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id ORDER BY COUNT(Likes.post_id) DESC LIMIT 5;`;

    let posts = await query(sql);

    res.render("featured-post", {
        posts,
        post: posts[0],
        isLoggedIn: req.session.isLoggedIn,
        likes: req.currentUser,
        user_id: req.session.user_id,
        image: req.session.profile_url,
    });
});

router.get("/mytopics", isLoggedIn, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id WHERE Users.user_id = '${req.session.user_id}' GROUP BY Posts.post_id;`;

    let posts = await query(sql);

    res.render("mytopics", {
        posts,
        post: posts[0],
        isLoggedIn: req.session.isLoggedIn,
        likes: req.currentUser,
        user_id: req.session.user_id,
        image: req.session.profile_url,
    });
});

router.get("/myanswers", isLoggedIn, async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT Users.username, Users.user_id, Users.profile, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id`;

    let post = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Comments.comment_text FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Users.user_id = '${req.session.user_id}' ORDER BY Comments.created_at DESC`;

    let comments = await query(sql);

    if (req.query.error) {
        return res.render("myanswers", {
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.user_id,
            post: post[0],
            likes: req.currentUser,
            comments: comments,
            error: req.query.error,
            image: req.session.profile_url,
            id: req.params.id,
        });
    }

    res.render("myanswers", {
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
        post: post[0],
        likes: req.currentUser,
        comments: comments,
        image: req.session.profile_url,
        id: req.params.id,
    });
});

router.get("/feedback", isLoggedIn, async (req, res) => {
    sql = `SELECT name, username, user_id, email FROM users WHERE user_id = '${req.session.user_id}'`;

    let user = await query(sql);

    res.render("feedback", {
        user: user[0],
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
        likes: req.currentUser,
        image: req.session.profile_url,
        id: req.params.id,
    });
});

router.get("/createpost", isLoggedIn, (req, res) => {
    res.render("createPost", {
        isLoggedIn: req.session.isLoggedIn,
        profile_image: req.session.pfp,
        user_id: req.session.user_id,
        image: req.session.profile_url,
    });
});

router.get("/createalbum", isLoggedIn, (req, res) => {
    res.render("createAlbum", {
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
        username: req.session.username,
        image: req.session.profile_url,
    });
});

router.get("/editpost/:id", isLoggedIn, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id;`;

    let posts = await query(sql);

    sql =
        `SELECT post_id, post_title, post_content FROM posts WHERE post_id=` +
        req.params.id;
    let result = await query(sql);

    res.render("editPost", {
        posts,
        res: res,
        data: result[0],
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
        image: req.session.profile_url,
    });
});

router.get("/editcomment/:id2/:id", isLoggedIn, async (req, res) => {
    const postId = req.params.id;
    const commentId = req.params.id2;

    let sql = `SELECT Users.username, Users.user_id, Users.profile, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id`;

    let post = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Comments.comment_id,Comments.post_id ,Comments.comment_text FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Comments.post_id = '${postId}'`;

    let comments = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Comments.comment_id,Comments.post_id ,Comments.comment_text FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Comments.post_id = '${postId}' and Comments.comment_id = '${commentId}'`;

    let comment_edit = await query(sql);

    if (req.query.error) {
        return res.render("editComment", {
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.user_id,
            post: post[0],
            likes: req.currentUser,
            comments: comments,
            error: req.query.error,
            image: req.session.profile_url,
            id: req.params.id,
            commentEdit: comment_edit[0],
        });
    }

    res.render("editComment", {
        isLoggedIn: req.session.isLoggedIn,
        user_id: req.session.user_id,
        post: post[0],
        likes: req.currentUser,
        comments: comments,
        image: req.session.profile_url,
        id: req.params.id,
        commentEdit: comment_edit[0],
    });
});

router.get("/register", isNotLoggedIn, (req, res) => {
    res.render("register");
});

router.get("/login", isNotLoggedIn, (req, res) => {
    res.render("login");
});

router.get("/forgot-password", isNotLoggedIn, (req, res) => {
    res.render("forgot-password");
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

router.post("/forgot-password", isNotLoggedIn, forgot);
router.post("/register", isNotLoggedIn, register);
router.post("/login", isNotLoggedIn, login);
router.post("/change-password", change);
router.post("/posts/:id/act", isLoggedIn, likes);
router.post("/users/:id/act", isLoggedIn, follow);
router.post("/users/:id/edit", isLoggedIn, editUser);
router.post("/createpost", isLoggedIn, createPost);
router.post("/createalbum", isLoggedIn, createAlbum);
router.post("/reportuser/:id", isLoggedIn, createReport);
router.post("/reportpost/:id2", isLoggedIn, createReport);
router.post("/feedback", isLoggedIn, createFeedback);
router.post("/posts/:id/create_comment", isLoggedIn, createComment);
router.post("/file/:id", uploadFiles);
router.put("/api/post/:id", isLoggedIn, updatepost);
router.put("/api/comment/:id", isLoggedIn, editComment);
router.delete("/api/:id", deletepost);
router.delete("/comment/:id", deleteComment);

module.exports = router;
