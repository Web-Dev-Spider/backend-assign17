require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/userDB");
const userRouter = require("./routes/userRouter");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

const PORT = process.env.PORT || 2000;
const ENV = process.env.ENV;

app.use(express.json());

app.use("/api", userRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("App started working");
});

app.listen(PORT, () => {
  console.log(`App started working in ${PORT} in ${ENV} environment`);
  connectToDB();
});
