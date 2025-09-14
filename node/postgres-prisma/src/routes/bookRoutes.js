const express = require('express');

const bookController = require("../controllers/bookController")

const router = express.Router()

router.post("/add-book", bookController.addBook)
router.get("/all-books", bookController.getAllBooks)
router.get("/:bookId", bookController.getBookById)
router.put("/update/:bookId", bookController.updateBook)
router.delete("/delete/:bookId", bookController.deleteBook)

module.exports = router