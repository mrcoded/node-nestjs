const express = require('express');
const app = express();

//middleware
app.use(express.json())

let books = [{
  id: 1,
  title: "Book 1",
  author: "Author 1"
},
{
  id: 2,
  title: "Book 2",
  author: "Author 2"
},
{
  id: 3,
  title: "Book 3",
  author: "Author 3"
}
]

//intro route books
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to my bookstore api"
  })

})

//GET all books
app.get('/all-books', (req, res) => {
  res.json(books)
})

//GET a single book
app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const book = books.find(book => book.id === id)
  if (book) {
    res.status(200).json(book)
  } else {
    res.status(404).json({
      message: "Book Not Found!"
    })
  }
})

//add a new book
app.post("/add-book", (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author
  }

  books.push(newBook)

  if (newBook) {
    res.status(201).json(
      { data: newBook, message: "Book added successfully" }
    )
  } else if (!newBook) {
    res.status(400).json({
      message: "Book details not added properly!"
    })
  } else {
    res.status(500).json({
      message: "Something went wrong"
    })
  }
})

//UPDATE a book
app.put("/update/:id", (req, res) => {
  const findCurrentBook = books.find(book => book.id === parseInt(req.params.id))

  if (findCurrentBook) {
    findCurrentBook.title = req.body.title || findCurrentBook.title
    findCurrentBook.author = req.body.author || findCurrentBook.author
  }

  if (findCurrentBook) {
    res.status(200).json(
      {
        data: findCurrentBook,
        message: `Book ID #${req.params.id} updated successfully`
      }
    )
  } else if (!findCurrentBook) {
    res.status(400).json({
      message: "Book not Found!"
    })
  } else {
    res.status(500).json({
      message: "Something went wrong"
    })
  }
})

//DELETE a book
app.delete("/delete/:id", (req, res) => {
  const findCurrentBookIndex = books.find(book => book.id === parseInt(req.params.id))

  if (findCurrentBookIndex !== -1) {
    const deletedBook = books.splice(findCurrentBookIndex, 1)
    res.status(200).json(
      {
        data: deletedBook[0],
        message: `Book deleted successfully`
      }
    )
  } else if (!findCurrentBookIndex) {
    res.status(400).json({
      message: "Book not Found!"
    })
  } else {
    res.status(500).json({
      message: "Something went wrong"
    })
  }
})


const port = 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
