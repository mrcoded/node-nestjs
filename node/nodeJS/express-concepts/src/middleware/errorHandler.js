//custom error class

class APIError extends Error {
  statusCode;
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError";
  }
}

const asyncHandler =
  (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const globalErrorHandler = (
  err,
  req,
  res,
  next
) => {
  console.log(err.stack); //log error stack

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message,
    });
  }
  //handles mongoose validation
  else if (err.name === "validationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation Error",
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occured!",
    });
  }
};

module.exports = { asyncHandler, globalErrorHandler, APIError };
