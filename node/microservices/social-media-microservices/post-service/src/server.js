require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const Redis = require("ioredis");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const postRoutes = require("./routes/post-routes")
const { connectRabbitMq } = require("./utils/rabbitmq");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3002;

//connect to mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to mongoDb"))
  .catch((e) => logger.error("Mongo connection error", e))

//create redis client
const redisClient = new Redis(process.env.REDIS_URL)

//middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  logger.info(`Recieved ${req.method} request to ${req.url}`)
  logger.info(`Request body, ${req.body}`)
  next()
})

//***Implement rate limiting 

//routes -> pass redisClient to routes
app.use("/api/post", (req, res, next) => {
  req.redisClient = redisClient
  next()
}, postRoutes)

//error handler
app.use(errorHandler)

async function startServer() {
  try {
    await connectRabbitMq()
    app.listen(PORT, () => {
      logger.info(`Post service running on port ${PORT}`)
    })
  } catch (error) {
    logger.error("Unable to connect to server", error)
    process.exit(1)
  }
}

startServer()

//unhandled promise rejection 
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason)
})