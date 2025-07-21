
const Product = require('../../models/MyProduct.model')

const resolvers = {
  Query: {
    products: async () => await Product.find({}),
    product: async (_, { id }) => await Product.findById(id)
  },

  Mutation: {
    createProduct: async (_, args) => {
      try {
        const newProduct = new Product(args)
        console.log(newProduct)
        return await newProduct.save()

      } catch (error) {
        console.log(error)
      }

      // products.push(newProduct)
      // return newProduct
    },
    deleteProduct: async (_, { id }) => {
      const deletedProduct = await Product.findByIdAndDelete(id)
      // if (index === -1) return null

      // const deletedProduct = products[index]
      // products.splice(index, 1)
      return deletedProduct
    },
    updateProduct: async (_, { id, ...updates }) => {
      const updatedProduct = await Product.findByIdAndUpdate(id, updates,
        { new: true }
      )
      // if (index === -1) return null

      // const updatedProduct = { ...products[index], ...updates }

      // products[index] = updatedProduct

      return updatedProduct
    }
  }
}

module.exports = resolvers