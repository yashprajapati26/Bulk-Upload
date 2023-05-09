const sequelize = require("../db");
const Sequelize = require("sequelize");

const Employees = sequelize.define(
  "employees",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    prefix: {
        type: Sequelize.ENUM("Mrs", "Mr", "Dr","Miss"),
        allowNull: false,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    phone_no: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    age: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      field: "created_at",
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      field: "updated_at",
      type: Sequelize.DATE,
    },
  },
  {
    freezeTableName: true,
    // disable the modification of tablenames; By default
  }
);

module.exports = Employees;
