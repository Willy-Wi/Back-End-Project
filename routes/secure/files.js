const { Router } = require("express");
const { query } = require("../../controllers/dbCon");
const router = Router();
const { createAlbum } = require("../../controllers/createAlbum");
const { uploadFiles } = require("../../controllers/filesCon");
const { isLoggedIn } = require("../../controllers/middleware/middleware");

router.get("/album/:id", async (req, res) => {
    const albumid = req.params.id;

    let sql = `SELECT file_id, album_id, file_url, file_type, thumb_url FROM files WHERE album_id = '${albumid}' ORDER BY created_at DESC`;
    let files = await query(sql);

    sql = `SELECT Users.name, Users.username, Users.user_id, Users.email, Users.profile_image FROM Users INNER JOIN Albums ON Albums.user_id = Users.user_id WHERE Albums.album_id = ${albumid}`;
    let user = await query(sql);

    sql = `SELECT album_name, album_cover, album_description FROM albums WHERE album_id = '${albumid}'`;
    let album = await query(sql);

    res.render("profile/addfiles", {
        albumid: albumid,
        album: album[0],
        files: files,
        file: files[0],
        isLoggedIn: req.session.isLoggedIn || false,
        user: user[0],
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
