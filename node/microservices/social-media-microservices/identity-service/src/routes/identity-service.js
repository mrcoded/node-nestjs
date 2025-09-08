const express = require('express');
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/identity-controller');

const router = express.Router()

router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/register", registerUser)
router.post("/refresh-token", refreshToken)

module.exports = router