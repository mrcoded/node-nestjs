
const adminMiddleware = async (req, res, next) => {
  const isAdmin = req.user.role === "admin"
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized Access"
    })
  }

  next()
}

module.exports = adminMiddleware