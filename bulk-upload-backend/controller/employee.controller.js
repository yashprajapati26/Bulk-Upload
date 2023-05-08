const employeeService = require("../service/employee.service");
const prefix = ["Mrs", "Mr", "Dr", "Miss"];
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
let errors = []
let success = []

const SaveData = async (req, res) => {
  try {
    const data = req.body
    console.log("data : ", data)

    data.filter((row) => {
      let flagError = 0;

      
      // prefix check
      if (row.prefix == "") {
        row.errors = "prefix is required, ";
        flagError = 1;
      } else {
        if (prefix.includes(row.prefix)) {
          console.log("prefix correct -", row.prefix);
          row.errors = "";
        } else {
          console.log("prefix wrong -", row.prefix);
          row.errors = "prefix not valid, ";
          flagError = 1;
        }
      }

      //email check
      if (row.email == "") {
        row.errors = row.errors + "email is required, ";
        flagError = 1;
      } else {
        if (emailRegexp.test(row.email)) {
          console.log("email correct -", row.email);
        } else {
          console.log("email wrong -", row.email);
          row.errors = row.errors + "email not correct, ";
          flagError = 1;
        }
      }

      // mobile check
      if (row.phone_no == "") {
        row.errors = row.errors + "phone number is required, ";
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
          row.errors = row.errors + "phone number must start with '+1 +91 +92', ";
          flagError = 1;
        }
      }

      //  age  check
      if (!isNaN(row.age)) {
        console.log("age correct -", row.age);
      } else {
        console.log("age no wrong -", row.age);
        row.errors = row.errors + "age must be number, ";
        flagError = 1;
      }

      if (flagError) {
        errors.push(row);
      } else {
        delete row.errors;
        success.push(row);
      }

    })
    console.log("output----------------------------------",success,errors)
    let created = await employeeService.bulkCreate(success)
    res.status(200).json({'msg':'sucessfully process done', success:success , errors:errors})
    
  } catch (e) {
    console.log(e)
    res.status(500).json({
      'msg': 'something is wrong'
    })
  }
};



module.exports = {
  SaveData,
};