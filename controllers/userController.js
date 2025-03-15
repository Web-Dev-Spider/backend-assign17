const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.EXPIRES_IN;

//create user

//Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

//Get user by id
const getUserById = async (req, res, next) => {
  try {
    // console.log("Getting user by id", req.params);
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//Update user by id
const updateUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const { name, email, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email }, //Only allows specific fields to be updated // Passwords can not be updated through this method,
      //as the userSchema.pre('save') wont run with findByIdAndUpdate method... so the password won't be encrypted
      //We can implement the hashing here.. but as per chatgpt it is not necessary.... changing password should be a seperate logic.. with forgot password...
      { new: true, runValidators: true } //returns the new values after update and validation check will be done
    );

    return res.status(200).json({ success: true, data: { Updated_User: updatedUser } });
  } catch (error) {
    next(error);
  }
};

//PUT Operation needs all the fields
const changeUserDetailsById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required for PUT Operation" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password: hashPassword },
      { new: true, runValidators: true, overwrite: true }
    );
    return res.status(200).json({ success: true, data: { Changed_User: updatedUser } });
  } catch (error) {
    next(error);
  }
};

//Delete user by id

const deleteUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    return res.status(200).json({ success: true, message: "User has been deleted", data: deletedUser });
  } catch (error) {
    next(error);
  }
};
module.exports = { getUsers, getUserById, updateUserById, changeUserDetailsById, deleteUserById };
