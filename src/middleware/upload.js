const util = require("util");
const multer = require("multer");
const Fs = require('@supercharge/fs');

const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const {roomId} = req.params;
    Fs.ensureDir(`${__basedir}/resources/static/assets/uploads/room_${roomId}/`)
    cb(null, __basedir + `/resources/static/assets/uploads/room_${roomId}/`);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
