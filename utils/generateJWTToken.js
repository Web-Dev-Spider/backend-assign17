const jwt = require("jsonwebtoken");

const generateJWTToken = (id) => {
  // console.log("id and username for generating token", id, userName);
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // console.log("token generated from the function", token);
  return token;
};

module.exports = generateJWTToken;
