const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user"); // Import User model for association

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cart",
    timestamps: false, // Disable default timestamps, as we manually define addedAt
  }
);

// Associate Cart with User and Product models
Cart.belongsTo(User, { foreignKey: "userId" });

module.exports = Cart;
