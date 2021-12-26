const { query } = require("./dbCon");

const edituser = async (req, res) => {
    const { username, name, email } = req.body;
    let sql = "UPDATE users SET username='" + username+ 
        "', name ='" + name + 
        "', email ='" + email +
        "' WHERE user_id=" + req.params.id;
    query(sql, (err) => {
        if(err) throw err;
    });
    res.redirect("/");
};

module.exports = { edituser };
