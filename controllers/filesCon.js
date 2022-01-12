const { query } = require("./dbCon");
const multer = require("multer");
const path = require("path");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");

const storage = multer.diskStorage({
    destination: path.join(__dirname + "./../public/images/"),
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const timeUpload = function (req, res, next) {
    res.setTimeout(180000, () => {
        next();
    });
};

const uploadFiles = function (req, res) {
    let upload = multer({
        storage: storage,
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(png|jpeg|jpg|mp4|mp3|mkv)$/)) {
                req.fileValidationError =
                    "Only support these media formats: PNG, JPEG, JPG, MP4, MP3, MKV";
                return cb(
                    null,
                    false,
                    new Error(
                        "Only support these media formats: PNG, JPEG, JPG, MP4, MP3, MKV"
                    )
                );
            }
            cb(undefined, true);
        },
    }).array("file-upload");

    upload(req, res, (err) => {
        let albumid = req.params.id;
        let files = req.files;
        req.socket.setTimeout(10 * 60 * 1000);
        if (err) {
            throw err;
        }

        function generateThumbName(length) {
            let hasil = "";
            let karakter =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let karakterget = karakter.length;
            for (let index = 0; index < length; index++) {
                hasil += karakter.charAt(
                    Math.floor(Math.random() * karakterget)
                );
            }
            return hasil;
        }

        for (let index = 0; index < files.length; index++) {
            if (files[index].mimetype.match(/(mp4|mkv)/)) {
                files[index].thumbnail = generateThumbName(29);

                ffmpeg.setFfmpegPath(ffmpegInstaller.path);
                new ffmpeg(req.files[index].path).takeScreenshots({
                    filename: `${files[index].thumbnail}`,
                    count: 1,
                    timemarks: ["0"],
                    folder: `${files[index].destination}`,
                });

                files[index].thumbnail = files[index].thumbnail.concat(".png");
            }

            let sql = "INSERT INTO files SET ?";
            let data = {
                album_id: albumid,
                file_url: files[index].filename,
                file_type: files[index].mimetype,
                thumb_url: files[index].thumbnail,
            };
            query(sql, data);
        }
        res.json({
            status: 200,
            error: null,
        });
    });
};

module.exports = { uploadFiles, timeUpload };
