const Book = require("../models/book.model")

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find({})
    if (allBooks.length > 0) {
      res.status(200).json({
        success: true,
        message: "All books",
        data: allBooks
      })
    } else {
      res.status(404).json({
        success: false,
        message: "No books found"
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

const getBookById = async (req, res) => {
  try {
    const getCurrentBookID = req.params.id
    const bookData = await Book.findById(getCurrentBookID)
    if (bookData) {
      res.status(200).json({
        success: true,
        message: "Book found",
        data: bookData
      })
    } else {
      res.status(404).json({
        success: false,
        message: "Book not found"
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

const createNewBook = async (req, res) => {
  try {
    const newBookData = req.body
    const newBook = await Book.create(newBookData)
    console.log(newBook, newBookData)
    if (newBookData) {
      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: newBook
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

const updateBookById = async (req, res) => {
  try {
    const updatedBookData = req.body
    const getCurrentBookID = req.params.id
    const updatedBook = await Book.findByIdAndUpdate(getCurrentBookID, updatedBookData,
      { new: true })
    if (updatedBook) {
      res.status(200).json({
        success: true,
        message: "Book Updated Successfully",
        data: updatedBook
      })
    } else {
      res.status(404).json({
        success: false,
        message: "Book not found"
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

const deleteBookById = async (req, res) => {
  try {
    const getCurrentBookID = req.params.id
    const deletedBook = await Book.findByIdAndDelete(getCurrentBookID)
    if (deletedBook) {
      res.status(200).json({
        success: true,
        message: "Book Deleted Successfully",
        data: deletedBook
      })
    } else {
      res.status(404).json({
        success: false,
        message: "Book not found"
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
  getAllBooks,
  getBookById,
  createNewBook,
  updateBookById,
  deleteBookById
}