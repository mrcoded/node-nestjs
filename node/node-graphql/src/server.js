require('dotenv').config()

const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require('@apollo/server/standalone');
const connectToDb = require('./lib/db')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')


async function startServer() {
  // Connect to MongoDB 
  await connectToDb()

  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT }
  })

  console.log(`🚀 Server ready at: ${url}`);
}

startServer()