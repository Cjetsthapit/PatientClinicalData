const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();
const {verifyToken, tokenBlacklist} = require("./auth");
router.post("/register", async (req, res) => {
  const { firstName, lastName, address, email, phoneNumber, password } =
    req.body;

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    firstName: firstName,
    lastName: lastName,
    address: address,
    email: email,
    phoneNumber: phoneNumber,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ error: "Email is not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Password is incorrect" });

    const token = jwt.sign({ _id: user._id }, "mySuperSecretKey");

    // Create an object containing the token and user details
    const responseObj = {
      token: token,
      user: user
    };

    // Send the object as JSON in the response
    res.status(200).send(responseObj);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", verifyToken, (req, res) => {
  // Add the token to the blacklist
  const token = req.header("auth-token");
  tokenBlacklist.push(token);

  res.status(200).send("Logout successful");
});

module.exports = router;
