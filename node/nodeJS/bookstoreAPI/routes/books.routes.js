const express = require('express');
const {
  getAllBooks,
  getBookById,
  createNewBook,
  updateBookById,
  deleteBookById
} = require('../controllers/books.controler');

//create express router
const router = express.Router();

//all books routes
router.get("/all-books", getAllBooks)
router.get("/book/:id", getBookById)
router.post("/add-book", createNewBook)
router.put("/update/:id", updateBookById)
router.delete("/delete/:id", deleteBookById)

module.exports = router