const employeeService = require("../service/employee.service");
const prefix = ["Mrs", "Mr", "Dr", "Miss"];
const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const SaveData = async (req, res) => {
  try {
    const data = req.body;
    console.log("data : ", data);
    let errors = [];
    let success = [];

    data.filter((row) => {
      let flagError = 0;

      // prefix check
      if (row.prefix == "") {
        row.errors = "Prefix is required, ";
        flagError = 1;
      } else {
        if (prefix.includes(row.prefix)) {
          console.log("Prefix correct -", row.prefix);
          row.errors = "";
        } else {
          console.log("prefix wrong -", row.prefix);
          row.errors = "Prefix not valid, ";
          flagError = 1;
        }
      }

      //email check
      if (row.email == "") {
        row.errors = row.errors + "Email is required, ";
        flagError = 1;
      } else {
        if (emailRegexp.test(row.email)) {
          // check its repeate in array
          let count = data.filter((r) => r.email == row.email);
          if (count.length > 1) {
            row.errors = row.errors + "Email must be unique, ";
            flagError = 1;
          } else {
            console.log("email correct -", row.email);
          }
        } else {
          console.log("email wrong -", row.email);
          row.errors = row.errors + "Email not correct, ";
          flagError = 1;
        }
      }

      // mobile check
      if (row.phone_no == "") {
        row.errors = row.errors + "Phone_no is required, ";
        flagError = 1;
      } else {
        if (
          row.phone_no.startsWith("+91") ||
          row.phone_no.startsWith("+1") ||
          row.phone_no.startsWith("+92")
        ) {
          console.log("phone correct -", row.phone_no);
        } else {
          console.log("phone no wrong -", row.phone_no);
          row.errors = row.errors + "Phone_no must start with '+1 +91 +92', ";
          flagError = 1;
        }
      }

      //  age  check
      if (row.age == "") {
        row.errors = row.errors + "Age is required, ";
        flagError = 1;
      } else {
        if (!isNaN(row.age)) {
          console.log("age correct -", row.age);
        } else {
          row.errors = row.errors + "Age must be number, ";
          flagError = 1;
        }
      }

      if (flagError) {
        errors.push(row);
      } else {
        delete row.errors;
        success.push(row);
      }
    });

    const latestSuccess = [];
    const latestErrors = errors;

    await Promise.all(
      success.map(async (row) => {
        let isExist = await employeeService.findOne(["id"], {
          email: row.email,
        });
        console.log("is exist : ", isExist);
        if (isExist) {
          row.errors = "Dublicate email in database, ";
          latestErrors.push(row);
          console.log("after pop :", row);
        } else {
          latestSuccess.push(row);
        }
      })
    );

    await employeeService.bulkCreate(latestSuccess);

    return res.status(200).json({
      msg: "sucessfully process done",
      successArray: latestSuccess,
      errorsArray: latestErrors,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: "something is wrong",
    });
  }
};

module.exports = {
  SaveData,
};
