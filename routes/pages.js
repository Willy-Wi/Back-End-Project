const { Router } = require("express");
const { query } = require("../controllers/dbCon");
const router = Router();
const { register, login, forgot, change } = require("../controllers/authCon");
const { likes } = require("../controllers/likeCon");
const { follow, editUser } = require("../controllers/userCon");
const { createReport, createFeedback } = require("../controllers/report_feedbackCon");
const { createAlbum } = require("../controllers/createAlbum");
const { uploadFiles } = require("../controllers/filesCon");

const { createComment, editComment, deleteComment } = require("../controllers/commentCon");
const { createPost, editPost, deletePost } = require("../controllers/postCon");

// Additional query only if the user is logged in and approved
const loginRequired = async (req, res, next) => {
    if (req.session.user) {
        let sql = `SELECT * FROM likes WHERE user_id = '${req.session.user.user_id}'`;
        req.likesInfo = await query(sql);
        sql = `SELECT * FROM following WHERE following_id = '${req.session.user.user_id}'`;
        req.followInfo = await query(sql);
    
    }
    next();
};

const postPermsReq = async (req, res, next) => {
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

const userPermsReq = async (req, res, next) => {
    if (!(req.session.user.user_id == req.params.user)) {
        return res.redirect("/");
    }
    next();
};

const commentPermsReq = async (req, res, next) => {
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

router.get("/", loginRequired, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file ,Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id;`;
    let posts = await query(sql);
    res.render("posts/home", {
        posts,
        user: req.session.user || "",
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        search: req.query.search,
    });
});

router.get("/users/:id", loginRequired, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file ,Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id WHERE Users.user_id = '${req.params.id}' GROUP BY Posts.post_id`;
    let posts = await query(sql);

    sql = `SELECT album_id, album_name, album_cover, album_description, album_date, user_id FROM albums WHERE user_id = '${req.params.id}'`;
    let albums = await query(sql);

    sql = `SELECT Users.user_id, Users.username, Users.name, Users.profile_image, COUNT(DISTINCT following.following_id) AS 'Followers', COUNT(DISTINCT Likes.like_id) AS 'Likes' , COUNT(DISTINCT Posts.post_id) AS 'Posts'
    FROM Following RIGHT JOIN Users ON Users.user_id = Following.user_id
    LEFT JOIN Posts ON Users.user_id = Posts.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Users.user_id = '${req.params.id}' GROUP BY Users.user_id`;
    let userInfo = await query(sql);
    
    res.render("profile/profile", {
        user: req.session.user || "",
        isLoggedIn: req.session.isLoggedIn || false,
        posts,
        userInfo: userInfo[0],
        likes: req.likesInfo,
        follow: req.followInfo,
        albums,
        id: req.params.id,
    });
});

router.get("/posts/:id", loginRequired, async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file ,Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id`;

    let post = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Comments.comment_id, Comments.post_id, Comments.comment_content FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Comments.post_id = '${postId}'`;

    let comments = await query(sql);

    if (req.query.error) {
        return res.render("comments/comments", {
            user: req.session.user || "",
            isLoggedIn: req.session.isLoggedIn || false,
            post: post[0],
            likes: req.likesInfo,
            comments: comments,
            error: req.query.error,
            id: req.params.id,
        });
    }
    res.render("comments/comments", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        post: post[0],
        likes: req.likesInfo,
        comments: comments,
        id: req.params.id,
    });
});

router.get("/album/:id", async (req, res) => {
    const albumid = req.params.id;

    let sql = `SELECT file_id, album_id, file_url, file_type, thumb_url FROM files WHERE album_id = '${albumid}' ORDER BY created_at DESC`;
    let files = await query(sql);

    sql = `SELECT Users.name, Users.username, Users.user_id, Users.email, Users.profile_image FROM Users INNER JOIN Albums ON Albums.user_id = Users.user_id WHERE Albums.album_id = ${albumid}`;
    let user = await query(sql);

    sql = `SELECT album_name, album_cover, album_description FROM albums WHERE album_id = '${albumid}'`;
    let album = await query(sql);

    res.render("profile/addfiles", {
        albumid: albumid,
        album: album[0],
        files: files,
        file: files[0],
        isLoggedIn: req.session.isLoggedIn || false,
        user: user[0],
        user: req.session.user || "",
    });
});

router.get("/reportpost/:id", async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title,Posts.post_file , Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id;`;

    let posts = await query(sql);

    res.render("posts/reportPost", {
        posts,
        post: posts[0],
        id: postId,
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
    });
});

router.get("/search", loginRequired, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(DISTINCT Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Users.username LIKE '%${req.query.search}%' OR Posts.post_title LIKE '%${req.query.search}%' OR Posts.post_content LIKE '%${req.query.search}%'
    GROUP BY Posts.post_id`;

    let posts = await query(sql);

    res.render("posts/home", {
        posts,
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
        search: req.query.search,
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

router.get("/users/:id/edit", isLoggedIn, async (req, res) => {
    let sql = `SELECT name, username, user_id, email FROM users WHERE user_id = '${req.params.id}'`;
    let user = await query(sql);
    res.render("profile/edit", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        err: req.session.err || "",
        userInfo: user[0],
    });
});

router.get("/featured-post", isNotLoggedIn, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file , Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id GROUP BY Posts.post_id ORDER BY COUNT(Likes.post_id) DESC LIMIT 5;`;

    let posts = await query(sql);

    res.render("posts/featured-post", {
        posts,
        post: posts[0],
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
    });
});

router.get("/mytopics", isLoggedIn, async (req, res) => {
    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file ,Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id WHERE Users.user_id = '${req.session.user_id}' GROUP BY Posts.post_id;`;

    let posts = await query(sql);

    res.render("posts/mytopics", {
        posts,
        post: posts[0],
        isLoggedIn: req.session.isLoggedIn || false,
        likes: req.likesInfo,
        user: req.session.user || "",
    });
});

router.get("/myanswers", isLoggedIn, async (req, res) => {
    const postId = req.params.id;

    let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_file ,Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id`;

    let post = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Comments.comment_content FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Users.user_id = '${req.session.user_id}' ORDER BY Comments.created_at DESC`;

    let comments = await query(sql);

    if (req.query.error) {
        return res.render("posts/myanswers", {
            isLoggedIn: req.session.isLoggedIn || false,
            user: req.session.user || "",
            post: post[0],
            likes: req.likesInfo,
            comments: comments,
            error: req.query.error,
            id: req.params.id,
        });
    }

    res.render("posts/myanswers", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        post: post[0],
        likes: req.likesInfo,
        comments: comments,
        id: req.params.id,
    });
});

router.get("/feedback", isLoggedIn, async (req, res) => {
    sql = `SELECT name, username, user_id, email FROM users WHERE user_id = '${req.session.user_id}'`;

    let user = await query(sql);

    res.render("feedback", {
        user: user[0],
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        likes: req.likesInfo,
        id: req.params.id,
    });
});

router.get("/createpost", isLoggedIn, (req, res) => {
    res.render("posts/createPost", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
    });
});

router.get("/createalbum", isLoggedIn, (req, res) => {
    res.render("profile/createAlbum", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
    });
});

router.get(
    "/editpost/:id/:user",
    isLoggedIn,
    postPermsReq,
    async (req, res) => {
        let sql = `SELECT Users.user_id, Posts.post_title, Posts.post_file,Posts.post_content, Posts.post_id
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id WHERE post_id = '${req.params.id}'`;

        let result = await query(sql);

        res.render("posts/editPost", {
            data: result[0],
            isLoggedIn: req.session.isLoggedIn || false,
            user: req.session.user || "",
        });
    }
);

router.get(
    "/editcomment/:id/:postId/:user",
    isLoggedIn,
    commentPermsReq,
    async (req, res) => {
        const postId = req.params.postId;
        const commentId = req.params.id;

        let sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_content, Posts.post_file , Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Posts.post_id = '${postId}' GROUP BY Posts.post_id`;

        let post = await query(sql);

        sql = `SELECT Users.username, Users.user_id, Comments.comment_id,Comments.post_id ,Comments.comment_content FROM Users INNER JOIN Comments ON
    Users.user_id = Comments.user_id WHERE Comments.comment_id = '${commentId}'`;

        let comment = await query(sql);

        if (req.query.error) {
            return res.render("comments/editComment", {
                isLoggedIn: req.session.isLoggedIn || false,
                user: req.session.user || "",
                post: post[0],
                likes: req.likesInfo,
                comment: comment[0],
                error: req.query.error,
                id: req.params.id,
            });
        }

        res.render("commentseditComment", {
            isLoggedIn: req.session.isLoggedIn || false,
            user: req.session.user || "",
            post: post[0],
            likes: req.likesInfo,
            comment: comment[0],
            id: req.params.id,
        });
    }
);

router.get("/register", isNotLoggedIn, (req, res) => {
    res.render("register", {
        isLoggedIn: req.session.isLoggedIn || false,
    });
});

router.get("/login", isNotLoggedIn, (req, res) => {
    res.render("login", {
        isLoggedIn: req.session.isLoggedIn || false,
    });
});

router.get("/forgot-password", isNotLoggedIn, (req, res) => {
    res.render("profile/forgot-password", {
        isLoggedIn: req.session.isLoggedIn || false,
    });
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

router.post("/register", isNotLoggedIn, register);
router.post("/login", isNotLoggedIn, login);

router.post("/forgot-password", isNotLoggedIn, forgot);
router.post("/change-password", change);
router.post("/posts/:id/act", isLoggedIn, likes);
router.post("/users/:id/act", isLoggedIn, follow);
router.post("/createpost", isLoggedIn, createPost);
router.post("/createalbum", isLoggedIn, createAlbum);
router.post("/reportuser/:id", isLoggedIn, createReport);
router.post("/reportpost/:id2", isLoggedIn, createReport);
router.post("/feedback", isLoggedIn, createFeedback);
router.post("/posts/:id/create_comment", isLoggedIn, createComment);
router.post("/file/:id", uploadFiles);

router.post("/users/:user/edit", isLoggedIn, userPermsReq, editUser);
router.put("/posts/:id/:user", isLoggedIn, postPermsReq, editPost);
router.put("/comment/:id/:user", isLoggedIn, commentPermsReq, editComment);

router.delete("/posts/:id/:user", postPermsReq, deletePost);
router.delete("/comment/:id/:user", commentPermsReq, deleteComment);

module.exports = router;
