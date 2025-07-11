const Author = require("../models/Author.model")
const Book = require("../models/Book.model")

const createABook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body)
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: newBook
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
}

const createAuthor = async (req, res) => {
  try {
    const author = await Author.create(req.body)
    res.status(201).json({
      success: true,
      message: "Author created successfully",
      data: author
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
}

const getBookWithAuthor = async (req, res) => {
  try {
    //populates books with ref to author
    const book = await Book.findById(req.params.id).populate("author")

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      })
    }
    res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      data: book
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
}

module.exports = {
  createABook,
  createAuthor,
  getBookWithAuthor
}