const { Sequelize } = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize("ecommerce", "root", "Subru@123123123", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Disable logging for cleaner output
});

module.exports = sequelize;
