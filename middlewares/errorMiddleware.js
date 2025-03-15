const errorMiddleware = (err, req, res, next) => {
  try {
    console.log("in the error middleware");
    console.log(err.name);
    console.log(err);
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") {
      const message = "Invalid data type";
      error = new Error(message);
      error.statusCode = 400;
    }

    if (err.code === 11000) {
      const message = "Duplicate field";
      error = new Error(message);
      error.statusCode = 409;
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      // console.log("Validation error found by matching err.name", err.name);
      console.log(Object.values(err.errors).map((e) => e.message));
      const message = Object.values(err.errors).map((e) => e.message);
      error = new Error(message);
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal server error" });
  } catch (error) {
    console.log("This is the error caught:", error);
    next(error);
  }
  err.statusCode = 400;
};

module.exports = errorMiddleware;
