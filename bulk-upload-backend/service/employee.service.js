const Employees = require("../models/employees.model");

const findOne = async (attributes, condition) => {
  return await Employees.findOne({
    attributes: attributes,
    where: condition,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

const create = async (data) => {
  return await Employees.create(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

const bulkCreate = async (data) => {
  return await Employees.bulkCreate(data)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

module.exports = {
  findOne,
  create,
  bulkCreate,
};
