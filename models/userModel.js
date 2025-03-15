const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      minlength: [4, "User name must have 4 minimum characters"],
      maxlength: [25, "User name can not be more than 25 characters"],
      trim: true,
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: [true, "This email has already taken"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Passworsd should be minimum 6 characters."],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age can not be negative"],
      max: [100, "Age can not be more than 100"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
const User = new mongoose.model("users", userSchema);

module.exports = User;
