const { query } = require("./dbCon");
const path = require("path");
const sharp = require("sharp");

const createAlbum = (req, res) => {
    const { title, description } = req.body;
    if (req.files) {
        sharp(req.files.myAlbum.data)
            .resize(180, 200, {
                fit: "outside",
            })
            .toFile(
                path.resolve(
                    __dirname,
                    "../public/images/album" + title + ".png"
                )
            );
    }

    let sql = `INSERT INTO albums SET ?`;
    let data = {
        album_name: title,
        album_cover: title,
        album_description: description,
        user_id: req.session.user.user_id,
    };

    query(sql, data);

    res.redirect("/users/" + req.session.user.user_id);
};

module.exports = { createAlbum };
