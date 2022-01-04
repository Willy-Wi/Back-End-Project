const { query } = require("./dbCon")

const followFunc = {
    Follow: function (userId, user_id) {
        let sql = `INSERT INTO following SET ?`;
        let data = { user_id: userId, following_id: user_id };
        query(sql, data);
    },
    Unfollow: function (userId, user_id) {
        let sql = `DELETE FROM following WHERE following_id = '${user_id}' AND user_id = '${userId}'`;
        query(sql);
    }
}

const follow = (req, res) => {
    const user_id = req.session.user_id;
    const { action } = req.body;
    const userId = req.params.id;

    followFunc[action](userId, user_id);
}

const editUser = async (req, res) => {
    const { username, name, email } = req.body;
    let sql = "UPDATE users SET ?"
    let data = {
        username: username,
        name: name,
        email: email
    }
    await query(sql, data);
    res.redirect("/");
};

module.exports = { follow, editUser };