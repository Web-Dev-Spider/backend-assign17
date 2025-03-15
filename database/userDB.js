const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  throw new Error("DB URI is not available for db connection");
}
console.log(DB_URI);
const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("DB connection successful");
  } catch (error) {
    console.log(`Error connecting database`, error);
    // process.exit(1);
  }
};

module.exports = connectToDB;
