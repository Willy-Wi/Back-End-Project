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
    let pfp = 0;

    if (req.files) {
        pfp = req.params.id;
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

    let sql = `UPDATE users SET username = '${username}', name = '${name}', email = '${email}', profile_image = '${pfp}' WHERE user_id = '${req.session.user_id}'`;
    await query(sql);
    res.redirect("/");
};

module.exports = { follow, editUser };
