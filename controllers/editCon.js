const { query } = require("./dbCon");

const editUser = async (req, res) => {
    const { username, name, email } = req.body;
    const regex = /[^A-Za-z0-9_]/g;
    let errUser, errEmail;

    let sql = `SELECT name, username, user_id, email, profile_image FROM users WHERE user_id = '${req.params.id}'`;
    let user = await query(sql);

    sql = `SELECT Users.username, Users.user_id, Users.profile_image, Posts.post_title, Posts.post_content, Posts.post_id, COUNT(Likes.user_id) AS 'likes'
    FROM Users INNER JOIN Posts ON Posts.user_id = Users.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id WHERE Users.user_id = '${req.params.id}' GROUP BY Posts.post_id`;
    let posts = await query(sql);

    sql = `SELECT Users.user_id, COUNT(following.following_id) AS 'Followers', COUNT(Likes.like_id) AS 'Likes' , COUNT(Posts.post_id) AS 'Posts'
    FROM Following RIGHT JOIN Users ON Users.user_id = Following.user_id
    LEFT JOIN Posts ON Users.user_id = Posts.user_id
    LEFT JOIN Likes ON Likes.post_id = Posts.post_id
    WHERE Users.user_id = '${req.params.id}' GROUP BY Users.user_id`;
    let stats = await query(sql);

    sql = `SELECT * FROM following WHERE following_id = '${req.session.user_id}'`;
    let follow = await query(sql);

    if (username.match(regex)) {
        errUser = "Username can only contain numbers, letters, and underscores";
    } else if (username.length < 5) {
        errUser = "Username must be at least 5 characters long";
    }

    if (email.length < 5) {
        errEmail = "Email must be at least 5 characters long";
    }

    if (errUser || errEmail) {
        return res.render("edit", {
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.user_id,
            user: user[0],
            posts: posts,
            stats: stats[0],
            likes: req.currentUser,
            follow,
            image: req.session.pfp,
            users: user,
            id: req.params.id,
            errUser,
            errEmail
        });
    }

    sql = "UPDATE users SET username='@" + username+ 
        "', name ='" + name + 
        "', email ='" + email +
        "' WHERE user_id=" + req.params.id;
    await query(sql);
    res.redirect("/users/" + req.params.id + "/edit");
};

module.exports = { editUser };