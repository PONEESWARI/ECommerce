const sequelize = require("../config/database");

// Import models
const User = require("./user"); // Import the User model
const Order = require("./order"); // Import the Order model
// Import the OrderItems model
const Cart = require("./cart");

// Sync all models
sequelize
  .sync({ force: false }) // 'force: true' will drop tables and recreate them
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error syncing models:", err);
  });

module.exports = {
  User,
  Order,
  Cart
};
