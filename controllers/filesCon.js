const { query } = require("./dbCon");
const sharp = require("sharp");
const path = require("path");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");

const uploadFiles = async function (req, res) {
    files = req.files.fileUpload;
    let albumid = req.params.id;
    
    if(files.name.match(/(mp4|mkv)/)) {
        files.thumbnail = Date.now() + files.name;
        let uploadData = path.resolve(__dirname, '../public/images/' + files.thumbnail);
        let folder = path.resolve(__dirname, '../public/images/');
        files.mv(uploadData, (err) => {
            ffmpeg.setFfmpegPath(ffmpegInstaller.path);
            new ffmpeg(uploadData).takeScreenshots({
                filename: `${files.thumbnail}.png`,
                count: 1,
                timemarks: ["0"],
                folder: `${folder}`
            });
            if(err){
                throw err;
            }
        });
        let sql = "INSERT INTO files SET ?";
        let data = {
            album_id: albumid,
            file_url: files.thumbnail,
            file_type: files.mimetype,
            thumb_url: files.thumbnail + '.png',
        };
        await query(sql, data);
    }else{
        files.thumbnail = Date.now() + files.name;
        sharp(files.data)
            .toFile(
                path.resolve(
                    __dirname,
                    "../public/images/" + files.thumbnail
                )
            );
        let sql = "INSERT INTO files SET ?";
        let data = {
            album_id: albumid,
            file_url: files.thumbnail,
            file_type: files.mimetype,
            thumb_url: null,
        };
        await query(sql, data);
    }

    res.redirect('/album/' + albumid);

};

module.exports = { uploadFiles };
