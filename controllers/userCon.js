const { query } = require("./dbCon");
const path = require("path");
const sharp = require("sharp");

const followFunc = {
    Follow: function (userId, user_id) {
        let sql = `INSERT INTO following SET ?`;
        let data = { user_id: userId, following_id: user_id };
        query(sql, data);
    },
    Unfollow: function (userId, user_id) {
        let sql = `DELETE FROM following WHERE following_id = '${user_id}' AND user_id = '${userId}'`;
        query(sql);
    },
};

const follow = (req, res) => {
    const user_id = req.session.user_id;
    const { action } = req.body;
    const userId = req.params.id;

    followFunc[action](userId, user_id);
};

const editUser = async (req, res) => {
    const { username, name, email } = req.body;
    let errUser, errEmail;
    let pfp = 0;
    const regex = /[^A-Za-z0-9_]/g;
    if (username.match(regex)) {
        errUser = "Username can only contain numbers, letters, and underscores";
    } else if (username.length < 5) {
        errUser = "Username must be at least 5 characters long";
    }

    if (email.length < 5) {
        errEmail = "Email must be at least 5 characters long";
    }

    if (errUser || errEmail) {
        req.session.err = { errUser: errUser, errEmail: errEmail };
        return res.redirect(`/users/${req.params.user}/edit`);
    }

    let sql = `SELECT profile_image FROM users WHERE user_id = '${req.params.user}'`;
    let result = await query(sql);

    if (!(result[0].profile_image === 0)) {
        pfp = req.params.user;
    }

    if (req.files) {
        pfp = req.params.user;
        sharp(req.files.myImage.data)
            .resize(100, 100, {
                fit: "outside",
            })
            .toFile(
                path.resolve(
                    __dirname,
                    "../public/images/" + req.session.user_id + ".png"
                )
            );
    }

    sql = `UPDATE users SET username = '@${username}', name = '${name}', email = '${email}', profile_image = '${pfp}' WHERE user_id = '${req.session.user.user_id}'`;
    await query(sql);
    req.session.user.profile_image = req.session.user.user_id;
    req.session.err = "";
    res.redirect("/");
};

module.exports = { follow, editUser };
