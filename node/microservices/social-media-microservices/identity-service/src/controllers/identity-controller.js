const logger = require("../utils/logger")
const User = require("../models/User.model")
const generateTokens = require("../utils/generateToken")
const { validateRegistration, validateLogin } = require("../utils/validation")
const RefreshToken = require("../models/RefreshToken.model")

//user registration
const registerUser = async (req, res) => {
  logger.info("Registration endpoint hit...")
  try {
    //validate the schema
    const { error } = validateRegistration(req.body)
    if (error) {
      logger.warn("Validation Error", error.details[0].message)
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const { email, password, username } = req.body

    let user = await User.findOne({ $or: [{ email }, { username }] })
    if (user) {
      logger.warn("User already exists")
      return res.status(400).json({
        success: false,
        message: "User already exists"
      })
    }

    //if user does not exist
    user = new User({ username, password, email })
    await user.save()
    logger.info("User saved successfully", user._id)

    const { accessToken, refreshToken } = await generateTokens(user)

    res.status(201).json({
      success: true,
      message: "User successfully created",
      accessToken,
      refreshToken
    })
  } catch (error) {
    logger.error("Registration error!", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

//user login
const loginUser = async (req, res) => {
  // await User.refreshtokens.dropIndex("user_1")
  logger.info("Login endpoint hit...")
  try {
    //validate the schema
    const { error } = validateLogin(req.body)
    if (error) {
      logger.warn("Validation Error", error.details[0].message)
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const { email, password } = req.body

    //check if user is valid
    const user = await User.findOne({ $or: [{ email }] })
    if (!user) {
      logger.warn("Invalid User!")
      return res.status(400).json({
        success: false,
        message: "Invalid Credential"
      })
    }

    //check if password is correct
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      logger.warn("Invalid Password!")
      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      })
    }

    const { accessToken, refreshToken } = await generateTokens(user)

    res.status(200).json({
      success: true,
      message: "User successfully logged in",
      accessToken,
      refreshToken,
      userId: user._id
    })

  } catch (error) {
    logger.error("Login error!", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

//refresh token
const refreshToken = async (req, res) => {
  logger.info("Refresh token endpoint hit...")
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      logger.warn("Refresh token missing!")
      return res.status(400).json({
        success: false,
        message: "Refresh token missing"
      })
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken })
    if (!storedToken || storedToken.expiresAt < new Date()) {
      logger.warn("Refresh token invalid/expired!")

      return res.status(401).json({
        success: false,
        message: "Refresh token invalid/expired"
      })
    }

    const user = await User.findById(storedToken.user)
    if (!user) {
      logger.warn("User not found!")

      return res.status(401).json({
        success: false,
        message: "User not found"
      })
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user)

    //delete old refresh token
    await RefreshToken.deleteOne({ _id: storedToken._id })

    res.status(200).json({
      success: true,
      message: "Token successfully refreshed",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    })

  } catch (error) {
    logger.error("Refresh token error!", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

//logout
const logoutUser = async (req, res) => {
  logger.info("Logout endpoint hit...")
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      logger.warn("Refresh token missing!")
      return res.status(400).json({
        success: false,
        message: "Refresh token missing"
      })
    }

    await RefreshToken.deleteOne({ token: refreshToken })
    logger.info("Refresh token deleted for logout")

    res.status(200).json({
      success: true,
      message: "User successfully logged out"
    })
  } catch (error) {
    logger.error("Logout error!", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

module.exports = { registerUser, loginUser, refreshToken, logoutUser }