const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJWTToken = require("../utils/generateJWTToken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.EXPIRES_IN || "1d";

//Signup or Registration
//Signup flow -> Receives details from front end ->if everything alright -> saves the user ->
//  a token generated-> sends token back to frontend -> to store the token in cookies...

const signUp = async (req, res, next) => {
  try {
    console.log("in the signup middlewares");
    const { name, email, password } = req.body;
    console.log(name, email, password);

    //if any of the fields in the signup is missing or another datatype error, it will be handled by mongoose
    // and the global error object.

    const newUser = new User({
      name,
      email,
      password,
    });

    // const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || "1d" });

    await newUser.save();
    const token = generateJWTToken(newUser._id);
    res.cookie("token", token);
    return res.status(201).json({ message: "User added successfully", data: { user: newUser, token } });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//Signin or Login
// Receives login details--> pefrom checks to verify the credentials ->
//if everything is okey--> generates a token in the backend-->
//send to the frontend to save it in browser cookies.
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);

    if (!email || !password) {
      const error = new Error("Bad request. All fields are required");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("User does not exist.");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    const token = generateJWTToken(existingUser._id);

    console.log("\n******Token created at sign-in \n", token);

    //Adding cookies to response
    res.cookie("token", token);

    res.status(200).json({ success: true, message: "User signed in successfully", token });
  } catch (error) {
    console.log("Error at sign-in", error.message);
    next(error);
  }
};

//signout..when signout is being called... clears details/token in the cookie from the front end..>
//So user will have to enter the details to get signed in to get the token.. becuase the token is only generated
// eigther at login or signup... but is always verified in the authMiddleware.

const signOut = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = { signUp, signIn, signOut };
