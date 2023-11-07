
const jwt = require("jsonwebtoken");

// Create an array to store invalidated tokens
const tokenBlacklist = [];

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");

  // Check if the token is in the blacklist
  if (tokenBlacklist.includes(token)) {
    return res.status(401).send("Token has been invalidated");
  }

  try {
    const verified = jwt.verify(token, "mySuperSecretKey");
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

module.exports = { verifyToken, tokenBlacklist };