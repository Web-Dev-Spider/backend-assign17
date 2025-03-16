const authRouter = require("express").Router();

const { signUp, signIn, signOut } = require("../controllers/authController");

console.log(signUp);

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);

module.exports = authRouter;
