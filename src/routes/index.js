const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.post("/upload/:roomId", controller.upload);
  router.get("/files/:roomId", controller.getListFiles);
  router.get("/files/download/:roomId/:name", controller.download);

  app.use(router);
};

module.exports = routes;
