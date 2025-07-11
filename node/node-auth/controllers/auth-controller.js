const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//register User controller
const registerUser = async (req, res) => {
  try {
    //extract user data from request body
    const { username, email, password, role } = req.body

    //check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please try logging in."
      })
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user"
    })

    //save user to database
    await newUser.save()

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to create user!"
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong!"
    })
  }
}

//Login User controller
const login = async (req, res) => {
  try {
    //extract user data from request body
    const { username, password } = req.body

    //check if user exists
    const existingUser = await User.findOne({ username })
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!"
      })
    }

    //check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password!"
      })
    }

    //create token
    const token = jwt.sign({
      userId: existingUser._id,
      username: existingUser.username,
      role: existingUser.role
    }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" })


    if (existingUser) {
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid credentials!"
      })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong!"
    })
  }
}

//Change User Password controller
const changePassword = async (req, res) => {
  try {
    //GET userId data from request
    const userId = req.user.userId

    //extract password from request body
    const { oldPassword, newPassword } = req.body

    //find current logged in user
    const user = await User.findById(userId)

    //if user does not exist
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!"
      })
    }

    //check if old password is correct
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password)
    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password!"
      })
    }

    //hash new password
    const salt = await bcrypt.genSalt(10)
    const newHashedPassword = await bcrypt.hash(newPassword, salt)

    //update password
    user.password = newHashedPassword
    //save user
    await user.save()

    if (user) {
      res.status(200).json({
        success: true,
        message: "Password changed successfully"
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to change password!"
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong!"
    })
  }
}

module.exports = {
  registerUser,
  login,
  changePassword
}