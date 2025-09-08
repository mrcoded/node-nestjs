const logger = require("../utils/logger")

const authenticatedRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"]

  if (!userId) {
    logger.warn("No user ID, Access denied!")

    return res.status(401).json({
      success: false,
      message: "Unauthorized! Please Login."
    })
  }

  req.user = { userId }
  next()
}

module.exports = { authenticatedRequest }