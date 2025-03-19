const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");

const User = require("../models/userModel");

const authorize = async (req, res, next) => {
  try {
    console.log("in the authorize middleware");
    // const requestedUserId = req.params.userId; no need of params
    console.log("req.cookies", req.cookies.token);
    const { token } = req.cookies;

    console.log("token received", token);
    // console.log("type of token", typeof token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - Auth Middleware" });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token at auth middleware", decodedToken);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized - Auth Middleware" });
    }

    // console.log("decoded token user.id", decodedToken.userId);

    //**Not needed here , just because it is only a auth middleware...  */
    // if (requestedUserId !== decodedToken.userId)
    //   return res.status(401).json({ message: "Access denied, you are not authorized to view this details" });

    // const user = await User.findById(decodedToken.userId); *** this also to be done in the other user controller.

    // if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = decodedToken;
    next();
  } catch (error) {
    console.log("Error showed from auth middleware", error.message);
    return res.status(401).json({ message: "Unauthorizsed, Token verification failed", error: error.message });
  }
};

module.exports = authorize;
