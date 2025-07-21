const express = require('express');
const authMiddleware = require('../middleware/auth-middleware')

//create express router
const router = express.Router();

//home route
router.get("/home", authMiddleware, (req, res) => {
  const { username, role, userId } = req.user
  res.json({
    message: "Welcome to Home Page",
    user: {
      _id: userId,
      username,
      role
    }
  })
})

module.exports = router