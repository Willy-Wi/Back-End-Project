const { query } = require("./dbCon");
const path = require("path");
const sharp = require("sharp");
 
const createPost = (req, res) => {
    let namaPost = "";
    let time = Date.now();
    const { title, description } = req.body;
    if (req.files) {
        sharp(req.files.imgPost.data)
            .toFile(
                path.resolve(
                    __dirname,
                    "../public/images/imgPost/Post-" + time + ".png"
                )
            );
            namaPost = "Post-" + time + ".png";
    }
    let errTitle, errDesc;
    if (!(title.length >= 5 && title.length <= 255)) {
        errTitle = "Title length must be between 5 and 255 characters";
    }

    if (!(description.length >= 5 && description.length <= 1000)) {
        errDesc = "Description length must be between 5 and 1000 characters";
    }
    if (errTitle || errDesc) {
        res.render("posts/createPost", {
            isLoggedIn: req.session.isLoggedIn,
            user_id: req.session.user_id,
            profile_image: req.session.pfp,
            errTitle,
            errDesc,
        });
    } else {
        let sql = `INSERT INTO posts SET ?`;
        let data = {
            user_id: req.session.user_id,
            post_title: title,
            post_content: description,
            post_file: namaPost,
        };
        query(sql, data);

        res.redirect("/");
    }
};




const createComment = (req, res) => {
    const postId = req.params.id;
    const { comment } = req.body;
    let errReply;

    if (!(comment.length >= 5 && comment.length <= 1000)) {
        errReply = encodeURIComponent(
            "Comment length must be between 5 and 1000 characters"
        );
    } 
    
    if (errReply) {
        return res.redirect("/posts/" + postId + "/?error=" + errReply);
    } else {
        let sql = "INSERT INTO comments SET ?";
        let data = {
            user_id: req.session.user_id,
            post_id: postId,
            comment_content: comment,
        };
        query(sql, data);
        res.redirect("/posts/" + postId);
    }
};

const createReport = (req, res) => {
    const user_id = req.params.id || null;
    const post_id = req.params.id2 || null;
    const { description } = req.body;
    if (post_id == "") {
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
        user_id: req.session.user_id,
        message: message,
        name: name,
        contact: contact,
        email: email,
    };
    query(sql, data);
    res.redirect("/");
};

module.exports = { createPost, createComment, createReport, createFeedback };