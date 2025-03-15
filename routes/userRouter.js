const express = require("express");
const {
  signUP,
  getUsers,
  getUserById,
  updateUserById,
  changeUserDetailsById,
  deleteUserById,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/users", signUP);
userRouter.get("/users", getUsers);
userRouter.get("/users/:userId", getUserById);
userRouter.patch("/users/:userId", updateUserById);
userRouter.put("/users/:userId", changeUserDetailsById);
userRouter.delete("/users/:userId", deleteUserById);

module.exports = userRouter;
