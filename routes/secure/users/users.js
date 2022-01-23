const { Router } = require('express');
const router = Router();
const { query } = require('../../../controllers/dbCon');
const { isLoggedIn, loginRequired, userPerms } = require("../../../controllers/middleware/middleware");
const { editUser, follow } = require("../../../controllers/userCon");
const { createReport } = require("../../../controllers/report_feedbackCon");

router.get("/:id", loginRequired, async (req, res) => {
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
router.post("/users/report/:id", isLoggedIn, createReport);

module.exports = router;