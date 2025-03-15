const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.EXPIRES_IN || "1d";

//Signup or Registration
const signUp = async (req, res, next) => {
  try {
    console.log("in the signup middlewares");
    const { name, email, password } = req.body;
    console.log(name, email, password);

    //All fields required is handled by errorMiddleware
    // if (!name || !email || !password || !age) {
    //   const error = new Error("All fields are required");
    //   error.status = 404;
    //   throw error;
    // }
    const newUser = new User({
      name,
      email,
      password,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || "1d" });
    await newUser.save();

    return res.status(201).json({ message: "User added successfully", data: { user: newUser, token } });
  } catch (error) {
    next(error);
  }
};

//Signin or Login

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User does not exist.");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    console.log(token);

    res.status(200).json({ success: true, message: "User signed in successfully", data: { token, user } });
  } catch (error) {
    next(error);
  }
};
module.exports = { signUp, signIn };
