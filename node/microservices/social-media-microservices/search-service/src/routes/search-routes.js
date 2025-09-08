const express = require('express');
const { searchPostController } = require('../controllers/search-controller');


const router = express.Router()

router.get("/posts", searchPostController)

module.exports = router