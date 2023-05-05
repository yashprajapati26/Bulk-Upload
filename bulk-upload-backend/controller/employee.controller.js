const fs = require("fs");
const csv = require("fast-csv");

const getCsvFile = async (req, res) => {
  try {
    console.log("req file : ", req.file);

    let data = [];
    let errors = [];
    let success = [];

    if (req.file) {
      fs.createReadStream(req.file.path)
        .pipe(csv.parse({ headers: true }))
        .on("error", async (error) => console.error(error))
        .on("data", async (row) => {
          data.push(row);
          console.log(row);
          let flagError = 0;
          var keys = Object.keys(row);
          console.log("keys ------------->", keys);
          row.errors = "";
          keys.forEach((key) => {
            if (row[key] == "") {
              flagError = 1;
              row.errors += key + " field is required, ";
            }
          });

          if (flagError) {
            errors.push(row);
          } else {
            delete row.errors;
            success.push(row);
          }
        })
        .on("end", async () => {
          console.log(
            "read csv file complate...." + data.length + " records read"
          );

          let length = success.length;
          console.log("-->", length);
          console.log("sucess : ", success);
          console.log("error : ", errors);

          return res.status(200).json({
            msg: "success",
            data: {
              successArray: success,
              errorsArray: errors,
            },
          });
        });
    } else {
      return res.status(500).json({ msg: "please select file" });
    }
  } catch (e) {
    console.log("error : ", e);
    return res
      .status(500)
      .json({ msg: "something wrong / Internal Server Error" });
  }
};

module.exports = { getCsvFile };
