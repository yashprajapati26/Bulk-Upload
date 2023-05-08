var express = require("express");
var router = express.Router();
const employeeController = require("../controller/employee.controller");


/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("start server");
});


router.post("/uploadData", employeeController.SaveData);



module.exports = router;
