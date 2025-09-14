const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function addAuthor(name) {
  try {
    const newlyCreatedAuthor = await prisma.author.create({
      data: {
        name
      }
    })

    return newlyCreatedAuthor
  } catch (error) {
    console.error(error);
    throw error
  }
}

async function deleteAuthor(id) {
  try {
    const deleteAuthor = await prisma.author.delete({
      where: { id },
      include: { books: true }
    })
    console.log(id);
    return deleteAuthor
  } catch (error) {
    console.error(error);
    throw error
  }
}

module.exports = { addAuthor, deleteAuthor }