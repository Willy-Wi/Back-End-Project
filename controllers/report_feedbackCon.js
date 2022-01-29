const { query } = require("./dbCon");

const createReport = (req, res) => {
    const user_id = req.params.id || null;
    const post_id = req.params.id2 || null;
    const { description } = req.body;
    if (post_id == "" || post_id == null) {
        let sql = "INSERT INTO reports SET ?";
        let data = {
            user_id: user_id,
            post_id: post_id,
            type: "report_user",
            description: description,
        };
        query(sql, data);
        res.redirect("/");
    } else {
        let sql = "INSERT INTO reports SET ?";
        let data = {
            user_id: user_id,
            post_id: post_id,
            type: "report_post",
            description: description,
        };
        query(sql, data);
        res.redirect("/");
    }
};

const createFeedback = (req, res) => {
    const { subject, name, contact, email, message } = req.body;
    let sql = "INSERT INTO feedback SET ?";
    let data = {
        subject: subject,
        user_id: req.session.user.user_id,
        message: message,
        name: name,
        contact: contact,
        email: email,
    };
    query(sql, data);
    res.redirect("/");
};

module.exports = { createReport, createFeedback };
