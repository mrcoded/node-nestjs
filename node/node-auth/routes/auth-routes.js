const express = require('express');
const {
  registerUser,
  login,
  changePassword
} = require('../controllers/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');

//create express router
const router = express.Router();

//all User auth routes
router.post("/login", login)
router.post("/register", registerUser)
router.post(
  "/change-password",
  authMiddleware,
  changePassword)

module.exports = router