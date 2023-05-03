"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "employees",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        prefix: {
          type: Sequelize.ENUM("Mrs", "Mr", "Dr"),
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("employees");
  },
};
