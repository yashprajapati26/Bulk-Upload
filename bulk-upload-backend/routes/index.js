var express = require("express");
var router = express.Router();
const employeeController = require("../controller/employee.controller");
const multer = require("multer");
const { celebrate, Segments } = require("celebrate");
const { uploadValidator } = require("../validators/upload.validator");


// local storage for save post files
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/files");
  },
  filename: function (req, file, callback) {
    callback(null, "docs" + Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("start server");
});

router.post(
  "/uploadCsv",
  // celebrate({ [Segments.BODY]: uploadValidator }),
  upload.single("files"),
  employeeController.getCsvFile
);

module.exports = router;
