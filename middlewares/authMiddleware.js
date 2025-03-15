const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");

const User = require("../models/userModel");

const authorize = async (req, res, next) => {
  try {
    const requestedUserId = req.params.userId;
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log("token received", token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded.userId);

    if (requestedUserId !== decoded.userId)
      return res.status(401).json({ message: "Access denied, you are not authorized to view this details" });

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorizsed", error: error.message });
  }
};

module.exports = authorize;
