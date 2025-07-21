const express = require('express');
const { createAuthor, createABook, getBookWithAuthor } = require('../controllers/book-controller');

//create express router
const router = express.Router();

//route
router.post("/book", createABook)
router.post("/author", createAuthor)
router.get("/book/:id", getBookWithAuthor)

module.exports = router