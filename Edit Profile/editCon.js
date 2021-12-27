const { query } = require("./dbCon");

const edituser = async (req, res) => {
    const { username, name, email } = req.body;
    let sql = "UPDATE users SET username='" + username+ 
        "', name ='" + name + 
        "', email ='" + email +
        "' WHERE user_id=" + req.params.id;
    await query(sql);
    res.redirect("/");
};

module.exports = { edituser };
