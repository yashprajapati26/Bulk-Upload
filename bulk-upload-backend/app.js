var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
require("dotenv").config();
const cors = require("cors");

var indexRouter = require('./routes/index');

var app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", indexRouter);


let port = process.env.PORT || 3000
app.listen(port, async (err) => {
  if (err) throw err;
  else console.log(`server running on port ${port}`);
});


module.exports = app;
