const authorService = require("../services/authorService")

exports.addAuthor = async (req, res) => {
  try {
    const { name } = req.body
    const author = await authorService.addAuthor(name)

    res.status(201).json(author)
  } catch (error) {
    res.status(400).json(error)
  }
}

exports.deleteAuthor = async (req, res) => {
  try {
    const author = await authorService.deleteAuthor(parseInt(req.params.authorId))

    res.status(200).json({ message: `Author with id ${req.params.authorId} deleted successfully` })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}