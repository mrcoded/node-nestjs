const express = require('express');
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')

//create express router
const router = express.Router();

//home route
router.get("/welcome", authMiddleware, adminMiddleware, (req, res) => {
  const { username, role, userId } = req.user
  res.json({
    message: "Welcome to Admin Page",
    user: {
      _id: userId,
      username,
      role
    }
  })
})

module.exports = router