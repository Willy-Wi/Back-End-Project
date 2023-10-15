const { Router } = require("express");
const router = Router();
const { query } = require("../../../controllers/dbCon");
const {
    isLoggedIn,
    loginRequired,
    userPerms,
} = require("../../../controllers/middleware/middleware");
const { editUser, follow } = require("../../../controllers/userCon");
const { createReport } = require("../../../controllers/report_feedbackCon");

router.get("/:id", loginRequired, async (req, res) => {
    let sql = `SELECT users.username, users.user_id, users.profile_image, posts.post_title, posts.post_file ,posts.post_content, posts.post_id, COUNT(DISTINCT likes.user_id) AS 'likes'
    FROM users INNER JOIN posts ON posts.user_id = users.user_id
    LEFT JOIN likes ON likes.post_id = posts.post_id WHERE users.user_id = '${req.params.id}' GROUP BY posts.post_id`;
    let posts = await query(sql);

    sql = `SELECT album_id, album_name, album_cover, album_description, album_date, user_id FROM albums WHERE user_id = '${req.params.id}'`;
    let albums = await query(sql);

    sql = `SELECT users.user_id, users.username, users.name, users.profile_image, COUNT(DISTINCT following.following_id) AS 'Followers', COUNT(DISTINCT likes.like_id) AS 'likes' , COUNT(DISTINCT posts.post_id) AS 'posts'
    FROM following RIGHT JOIN users ON users.user_id = following.user_id
    LEFT JOIN posts ON users.user_id = posts.user_id
    LEFT JOIN likes ON likes.post_id = posts.post_id
    WHERE users.user_id = '${req.params.id}' GROUP BY users.user_id`;
    let userInfo = await query(sql);

    res.render("profile/profile", {
        user: req.session.user || "",
        isLoggedIn: req.session.isLoggedIn || false,
        posts,
        userInfo: userInfo[0],
        likes: req.likesInfo,
        follow: req.followInfo,
        albums,
    });
});

router.get("/:id/edit", isLoggedIn, async (req, res) => {
    let sql = `SELECT name, username, user_id, email FROM users WHERE user_id = '${req.params.id}'`;
    let user = await query(sql);
    res.render("profile/edit", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
        err: req.session.err || "",
        userInfo: user[0],
    });
});

router.post("/:id/act", isLoggedIn, follow);
router.post("/:user/edit", isLoggedIn, userPerms, editUser);
router.post("/report/:id", isLoggedIn, createReport);

module.exports = router;
