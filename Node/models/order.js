const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user"); // Import User model for association

const Order = sequelize.define(
  "Order",
  {
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically set current date
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "orders",
    timestamps: false, // Disable timestamps, as we manually define orderDate
  }
);

// Associate Order with User (foreign key: userId)
Order.belongsTo(User, { foreignKey: "userId" });

module.exports = Order;
