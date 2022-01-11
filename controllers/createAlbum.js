const { query } = require("./dbCon");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: path.join(__dirname + './../public/images/'),
});

const createAlbum = (req, res) =>{
    let upload = multer({storage: storage}).single('albumimg');
    upload(req, res, err => {
        const { userid, username, title, description } = req.body;    
        if(err) throw err;
        let sql = "INSERT INTO albums SET ?";
        let data = {
            album_name: title,
            album_cover: req.file.filename,
            album_description: description,
            user_id: req.session.user_id,
            username: req.session.username,
        };
        query(sql, data);
        res.redirect("/");
    });
};

module.exports = { createAlbum };