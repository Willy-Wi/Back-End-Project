const { query } = require("./dbCon");

const edituser = async (req, res) => {
    const { username, name, email } = req.body;
    const regex = /[^A-Za-z0-9_]/g;
    let errUser, errEmail;
    console.log("Hello World");
    console.log(username);
    console.log(name);
    console.log(email);
    let sql = "UPDATE users SET username='" + username+ 
        "', name ='" + name + 
        "', email ='" + email +
        "' WHERE user_id=" + req.params.id;
    query(sql, (err) => {
        if(err) throw err;
    });
    console.log(sql);
    res.redirect("/");
    // res.redirect("/users/edit/:id");
};

module.exports = { edituser };