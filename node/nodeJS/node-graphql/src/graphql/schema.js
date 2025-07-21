//this will be the structure for your data

const gql = require('graphql-tag');

const typeDefs = gql`
  type Product {
    id: ID!
    title: String!
    category: String!
    price: Float!
    inStock: Boolean!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
      createProduct(
      title: String!
      category: String!
      price: Float!
      inStock: Boolean!
    ): Product
      updateProduct(
      id: ID!
      title: String
      category: String
      price: Float
      inStock: Boolean
    ): Product
      deleteProduct(id: ID!): Product
  }
`
// query like controller in express

module.exports = typeDefs