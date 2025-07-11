const jwt = require("jsonwebtoken")

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  const token = authHeader && authHeader.split(" ")[1]
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized Access"
    })
  }

  //verify token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = decodedToken
    console.log(decodedToken)
    next()

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid Token"
    })
  }
}

module.exports = authMiddleware