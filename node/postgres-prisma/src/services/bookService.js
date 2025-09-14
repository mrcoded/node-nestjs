const { PrismaClient } = require("../generated/prisma")

const prisma = new PrismaClient()

async function addBooks(title, publishedDate, authorId) {
  try {
    const newlyCreatedBook = await prisma.book.create({
      data: {
        title,
        publishedDate,
        author: {
          connect: { id: authorId }
        }
      },
      include: { author: true }
    })

    return newlyCreatedBook
  } catch (error) {
    console.error(error);
    throw error
  }
}

async function getAllBooks() {
  try {
    const allBooks = await prisma.book.findMany({
      include: { author: true }
    })

    return allBooks
  } catch (error) {
    console.error(error);
    throw error
  }
}

async function getBookById(id) {
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!book) {
      throw new Error(`Book id ${id} not found`)
    }

    return book
  } catch (error) {
    console.error(error);
    throw error
  }
}

async function deleteBook(id) {
  try {
    const deleteBook = await prisma.book.delete({
      where: { id },
      include: { author: true }
    })

    if (!deleteBook) {
      throw new Error(`Book id ${id} not found`)
    }

    return deleteBook
  } catch (error) {
    console.error(error);
    throw error
  }
}

async function updateBookById(id, newTitle) {
  try {
    // const book = await prisma.book.findUnique({
    //   where: { id },
    //   include: { author: true }
    // })

    // if (!book) {
    //   throw new Error(`Book id ${id} not found`)
    // }

    // const updatedBook = await prisma.book.update({
    //   where: { id },
    //   data: { title: newTitle },
    //   include: { author: true }
    // })

    // return updatedBook

    //using transactions =
    const updatedBook = await prisma.$transaction(async prisma => {
      const book = await prisma.book.findUnique({ where: { id } })
      if (!book) {
        throw new Error(`Book id ${id} not found`)
      }

      return prisma.book.update({
        where: { id },
        data: {
          title: newTitle
        },
        include: { author: true }
      })
    })

    return updatedBook
  } catch (error) {
    console.error(error);
    throw error
  }
}

module.exports = {
  addBooks,
  getAllBooks,
  getBookById,
  getBookById,
  updateBookById,
  deleteBook
}