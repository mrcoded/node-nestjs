const jwt = require("jsonwebtoken")
const logger = require("../utils/logger")

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  const token = authHeader && authHeader.split(" ")[1]
  if (!token) {
    logger.warn("No token provided")
    res.status(401).json({
      success: false,
      message: "Unauthorized Access"
    })
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      logger.warn("Invalid token")
      res.status(429).json({
        success: false,
        message: "Invalid Token"
      })
    }

    req.user = user
    next()
  })
}

module.exports = { validateToken }