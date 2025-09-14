const bookService = require("../services/bookService")

exports.addBook = async (req, res) => {
  try {
    const { title, authorId, publishedDate } = req.body
    const book = await bookService.addBooks(
      title,
      new Date(publishedDate),
      authorId
    )

    res.status(201).json(book)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks()

    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(parseInt(req.params.bookId))

    if (book) {
      res.status(200).json(book)
    } else {
      res.status(404).json({ message: "Book not found" })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateBook = async (req, res) => {
  try {
    const { title } = req.body

    const book = await bookService.updateBookById(
      parseInt(req.params.bookId),
      title
    )

    res.json(book)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteBook = async (req, res) => {
  try {

    const book = await bookService.deleteBook(
      parseInt(req.params.bookId),
    )

    res.json({ message: `Book with ID ${req.params.bookId} deleted successfully` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}