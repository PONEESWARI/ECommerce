const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { User, Cart, Order } = require("./models"); // Assuming you have Sequelize models
const bodyParser = require("body-parser");
require("./models");

app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json()); // Parse incoming requests as JSON

// JWT Secret
const jwtSecret = "y  our_secret_key";

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Store user in request object
    next(); // Proceed to the next middleware or route handler
  });
}
// Login API
app.post("/api/auth/login", async (req, res) => {
  console.log(" C V V VG");
  try {
    const { email, password, role } = req.body;

    // Find user by username
    const user = await User.findOne({ where: { email } });
    if (!user || user.role !== role) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      jwtSecret,
      { expiresIn: "1h" }
    );
    console.log("token", token);

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.id,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  const { firstName, lastName, email, password, mobile, role } = req.body;
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error during signup" });
  }
});

app.get("/api/auth/users", async (req, res) => {
  try {
    const role = req.query.role; // Get the role from the authenticated user
    console.log("mkk", role);
    let users;
    if (role === "Admin") {
      // If the user is an admin, fetch only users with the role of 'user'
      users = await User.findAll({
        where: { role: "User" },
        attributes: ["firstName", "lastName", "email", "mobile", "role","id"], // Adjust as needed
      });
    } else {
      // If the user is not an admin, return an empty array or appropriate response
      users = [];
    }

    if (users.length) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found." });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error while fetching users." });
  }
});

app.get("/api/auth/check-email", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ where: { email } });
    console.log("User found:", user); // Log the user found

    // Respond with true if user exists, false otherwise
    if (user) {
      return res.status(200).json({ exists: true }); // Email is taken
    } else {
      return res.status(200).json({ exists: false }); // Email is available
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ message: "Error checking email" }); // Internal server error
  }
});

// Check if mobile number already exists
app.get("/api/auth/check-mobile", async (req, res) => {
  const { mobile } = req.query;

  try {
    const user = await User.findOne({ where: { mobile } });
    res.status(200).json(!!user); // Respond with true if user exists, false otherwise
  } catch (error) {
    console.error("Error checking mobile:", error);
    res.status(500).json({ message: "Error checking mobile" });
  }
});

app.post("/api/cart/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  console.log("req.body", req.body);

  try {
    // Check if the cart item already exists for the given user and product
    const existingCartItem = await Cart.findOne({
      where: { userId, productId },
    });

    if (existingCartItem) {
      // If the item exists, update its quantity
      existingCartItem.quantity = quantity;
      await existingCartItem.save();

      res.status(200).json({
        message: "Cart item updated successfully",
        cart: existingCartItem,
      });
    } else {
      // If the item doesn't exist, create a new cart item
      const newCartItem = await Cart.create({
        userId,
        productId,
        quantity,
      });

      res.status(201).json({
        message: "Cart item added successfully",
        cart: newCartItem,
      });
    }
  } catch (error) {
    console.error("Error adding/updating cart item:", error);
    res.status(500).json({ message: "Error adding/updating cart item" });
  }
});

app.put("/api/cart/update/:userId", async (req, res) => {
  const { userId } = req.params;
  const { quantity, id } = req.body;

  try {
    // Find the cart item for the user and update its quantity
    const updatedCartItem = await Cart.update(
      { quantity: quantity },
      {
        where: {
          userId: userId,
          productId: id,
        },
      }
    );

    // Check if the update was successful
    if (updatedCartItem[0] === 1) {
      res.status(200).json({ message: "Cart item updated successfully" });
    } else {
      res.status(404).json({ message: "Cart item not found" });
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item", error });
  }
});

app.post("/api/cart/create", async (req, res) => {
  const { items, orderId, orderDate, userId } = req.body;
  // const userId = req.body.userId; // Assuming userId is set from an auth middleware
  // console.log(userId, "userId");
  try {
    // Validate that each item in the order is unique for this user
    for (const item of items) {
      const existingOrder = await Order.findOne({
        where: {
          userId,
          productId: item.id,
        },
      });
      console.log(existingOrder, "existingOrder");
      if (existingOrder) {
        // return res.status(400).json({
        //   message: `Duplicate entry: User already has product with ID ${item.id} in the current order.`,
        // });
        console.log("duplicate entries");
      }
    }

    // Prepare the order entries for each unique item
    const orderEntries = items.map((item) => ({
      orderId,
      orderDate,
      userId,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));

    // Insert all unique items in the order into the Order table
    await Order.bulkCreate(orderEntries);

    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating order", details: error.message });
  }
});

app.get("/api/order/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("userid", userId);
    const orders = await Order.findAll({
      where: { userId: userId },
      attributes: [
        "orderId",
        "orderDate",
        "productId",
        "price",
        "quantity",
        "name",
      ],
      order: [["productId", "ASC"]], // Order by productId, then by orderDate descending
      group: ["productId"], // Group by productId to get only the latest per product
    });

    if (orders.length) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: "No orders found for this user." });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error while fetching orders." });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
