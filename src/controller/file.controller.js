const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    return res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
      type: req.file.mimetype,
      url: baseUrl + req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
        url: ''
      });
    }

    return res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  try {
    const { roomId } = req.params;
    const directoryPath = __basedir + `/resources/static/assets/uploads/room_${roomId}`;
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return res.status(500).send({
          message: "Unable to scan files!",
          name: 'NA',
          url: ''
        });
      }
      console.log(directoryPath,files)
  
      let fileInfos = [];
  
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      });
  
      return res.status(200).send(fileInfos);
    });
  } catch (error) {
    return res.status(500).send([{name: 'file',url: ''}]);
  }

};

const download = (req, res) => {
  const {name: fileName, roomId } = req.params;

  const directoryPath = __basedir + `/resources/static/assets/uploads/room_${roomId}/`;
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};
