const { Router } = require("express");
const { query } = require("../../controllers/dbCon");
const router = Router();
const { createAlbum } = require("../../controllers/createAlbum");
const { uploadFiles } = require("../../controllers/filesCon");
const { isLoggedIn } = require("../../controllers/middleware/middleware");

router.get("/album/:id", async (req, res) => {
    const albumId = req.params.id;

    let sql = `SELECT file_id, album_id, file_url, file_type, thumb_url FROM files WHERE album_id = '${albumId}' ORDER BY created_at DESC`;
    let files = await query(sql);

    sql = `SELECT users.name, users.username, users.user_id, users.email, users.profile_image FROM users INNER JOIN albums ON albums.user_id = users.user_id WHERE albums.album_id = ${albumId}`;
    let userInfo = await query(sql);

    sql = `SELECT album_name, album_cover, album_description FROM albums WHERE album_id = '${albumId}'`;
    let album = await query(sql);

    res.render("profile/addfiles", {
        albumId,
        album: album[0],
        files: files,
        file: files[0],
        isLoggedIn: req.session.isLoggedIn || false,
        userInfo: userInfo[0],
        user: req.session.user || "",
    });
});

router.get("/createalbum", isLoggedIn, (req, res) => {
    res.render("profile/createAlbum", {
        isLoggedIn: req.session.isLoggedIn || false,
        user: req.session.user || "",
    });
});

router.post("/createalbum", isLoggedIn, createAlbum);
router.post("/file/:id", uploadFiles);

module.exports = router;
