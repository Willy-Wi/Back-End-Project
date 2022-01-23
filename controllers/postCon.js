const { query } = require("./dbCon");
const path = require("path");
const sharp = require("sharp");

const createPost = (req, res) => {
    let namaPost = "";
    let time = Date.now();
    const { title, description } = req.body;
    if (req.files) {
        sharp(req.files.imgPost.data).toFile(
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
            user: req.session.user || "",
            errTitle,
            errDesc,
        });
    } else {
        let sql = `INSERT INTO posts SET ?`;
        let data = {
            user_id: req.session.user.user_id,
            post_title: title,
            post_content: description,
            post_file: namaPost,
        };
        query(sql, data);

        res.redirect("/");
    }
};

const deletePost = async (req, res) => {
    const postId = req.params.id;

    let sql = `DELETE FROM posts WHERE post_id = ${postId}`;
    await query(sql);

    res.json({
        status: 200,
    });
};

const editPost = async (req, res) => {
    const { title, description } = req.body;
    let errTitle, errDesc;
    if (!(title.length >= 5 && title.length <= 255)) {
        errTitle = "Title length must be between 5 and 255 characters";
    }

    if (!(description.length >= 5 && description.length <= 1000)) {
        errDesc = "Description length must be between 5 and 1000 characters";
    }

    if (errTitle) {
        res.json({
            status: 404,
            error: errTitle,
        });
    } else if (errDesc) {
        res.json({
            status: 404,
            error: errDesc,
        });
    } else {
        let sql = `UPDATE posts SET post_title = "${title}", post_content = "${description}" WHERE post_id = ${req.params.id}`;
        await query(sql);
        res.json({
            status: 200,
        });
    }
};

module.exports = { createPost, editPost, deletePost };
