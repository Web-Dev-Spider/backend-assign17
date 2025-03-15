const express = require("express");
const {
  getUsers,
  getUserById,
  updateUserById,
  changeUserDetailsById,
  deleteUserById,
} = require("../controllers/userController");

const authorize = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter.get("/all-users", getUsers);
userRouter.get("/:userId", authorize, getUserById);
userRouter.patch("/:userId", updateUserById);
userRouter.put("/:userId", changeUserDetailsById);
userRouter.delete("/:userId", deleteUserById);

module.exports = userRouter;
