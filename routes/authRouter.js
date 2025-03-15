const authRouter = require("express").Router();

const { signUp, signIn } = require("../controllers/authController");

console.log(signUp);

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);

module.exports = authRouter;
