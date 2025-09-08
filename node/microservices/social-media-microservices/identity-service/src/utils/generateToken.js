const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require("../models/RefreshToken.model")

const generateTokens = async (user) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY not set in environment variables");
  }

  const accessToken = jwt.sign({
    userId: user._id,
    username: user.username
  }, process.env.JWT_SECRET_KEY, { expiresIn: "60m" })

  const refreshToken = crypto.randomBytes(40).toString("hex")
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) //refreshToken expires in 7 days

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt
  })

  return { refreshToken, accessToken }
}

module.exports = generateTokens
