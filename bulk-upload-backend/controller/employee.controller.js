const fs = require("fs");
const csv = require("fast-csv");
const Employees = require("../models/employees.model");
const employeeService = require("../service/employee.service");
const { parseAsync } = require("json2csv");
const path = require("path");

// Convert data to CSV format
async function convertToCSV(data) {
  try {
    return await parseAsync(data);
  } catch (error) {
    console.error("Error converting data to CSV:", error);
    throw error;
  }
}

// Save data to CSV file
async function saveToCSV(data, filePath) {
  try {
    const csvData = await convertToCSV(data);
    fs.writeFileSync(
      path.join(__dirname, "../public/files-result", filePath),
      csvData,
      "utf8"
    );
    console.log(
      `Data saved to ${path.join(
        __dirname,
        "../public/files-result",
        filePath
      )}`
    );
    return "files-result/" + filePath;
  } catch (error) {
    console.error("Error saving data to CSV:", error);
    throw error;
  }
}

const getCsvFile = async (req, res) => {
  try {
    console.log("req file : ", req.file);

    let data = [];
    let prefix = ["Mrs", "Mr", "Dr"];
    let errors = [];
    let success = [];
    let file1Path;
    let file2Path;
    const emailRegexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (req.file) {
      fs.createReadStream(req.file.path)
        .pipe(csv.parse({ headers: true }))
        .on("error", async (error) => console.error(error))
        .on("data", async (row) => {
          data.push(row);
          let flagError = 0;

          // prefix check
          if (prefix.includes(row.prefix)) {
            console.log("prefix correct -", row.prefix);
            row.errors = "";
          } else {
            console.log("prefix wrong -", row.prefix);
            row.errors = "prefix not valiid ,";
            flagError = 1;
          }

          if (emailRegexp.test(row.email)) {
            console.log("email correct -", row.email);
          } else {
            console.log("email wrong -", row.email);
            row.errors = row.errors + "email not correct,";
            flagError = 1;
          }

          // mobile check
          if (
            row.phone_no.startsWith("+91") ||
            row.phone_no.startsWith("+1") ||
            row.phone_no.startsWith("+92")
          ) {
            console.log("phone correct -", row.phone_no);
          } else {
            console.log("phone no wrong -", row.phone_no);
            row.errors = row.errors + "phone number not correct,";
            flagError = 1;
          }

          // // age  check
          if (!isNaN(row.age)) {
            console.log("age correct -", row.age);
          } else {
            console.log("age no wrong -", row.age);
            row.errors = row.errors + "age not correct,";
            flagError = 1;
          }

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
          var bar = new Promise((resolve, reject) => {
            success.forEach(async (row, index) => {
              let isExist = await employeeService.findOne(["id"], {
                email: row.email,
              });
              if (isExist) {
                let popVal = success.pop(row);
                popVal.errors = "dublicate email / email already used";
                errors.push(popVal);
              } else {
                // save valid data in database
                await employeeService.create(row);
              }
              if (index === length - 1) {
                resolve();
              }
            });
          });

          bar.then(async () => {
            console.log("sucess : ", success);
            console.log("error : ", errors);
            let csv1;
            if (success.length > 0) {
              // let saveData = await Employees.bulkCreate(success);
              // Save sheet 1 data to a CSV file
              csv1 = "success-" + req.file.filename;
              file1Path = await saveToCSV(success, csv1);
            }
            if (errors.length > 0) {
              // Save sheet 2 data to another CSV file
              let csv2 = "errors-" + req.file.filename;
              file2Path = await saveToCSV(errors, csv2);
            }

            return res.status(200).json({
              msg: "success",
              data: {
                success: file1Path,
                errors: file2Path,
                successArray: success,
                errorsArray: errors,
              },
            });
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
