const express = require('express');

const authorController = require("../controllers/authorController")

const router = express.Router()

router.post("/add-author", authorController.addAuthor)
router.delete("/delete/:authorId", authorController.deleteAuthor)

module.exports = router