const rateLimit = require("express-rate-limit");

const createBasicRateLimiter = (maxRequests, time) => {
  return rateLimit({
    max: maxRequests,
    windowMs: time,
    message: "Too many requests from this IP, please try again later",
    legacyHeaders: false,
    standardHeaders: true,
  });
};

module.exports = createBasicRateLimiter
