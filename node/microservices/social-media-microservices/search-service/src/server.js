require("dotenv").config();
const cors = require('cors');
const helmet = require('helmet');
const Redis = require("ioredis");
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const searchRoutes = require('./routes/search-routes')
const errorHandler = require('./middleware/errorHandler');
const { connectRabbitMq, consumeEvent } = require("./utils/rabbitmq");
const { handlePostCreate, handlePostDelete } = require("./eventHandlers/search-event-handler");

const app = express();
const PORT = process.env.PORT || 3003;

//connect to mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to mongoDb"))
  .catch((e) => logger.error("Mongo connection error", e))

//create redis client
const redisClient = new Redis(process.env.REDIS_URL)

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use((req, res, next) => {
  logger.info(`Recieved ${req.method} request to ${req.url}`)
  logger.info(`Request body, ${req.body}`)
  next()
})

//***Implement rate limiting 

app.use("/api/search", (req, res, next) => {
  req.redisClient = redisClient
  next()
}, searchRoutes)

//error handler
app.use(errorHandler)


async function startServer() {
  try {
    await connectRabbitMq()

    //consume to the events
    await consumeEvent("post.created", handlePostCreate)
    await consumeEvent("post.deleted", handlePostDelete)

    app.listen(PORT, () => {
      logger.info(`Search service running on port ${PORT}`)
    })
  } catch (error) {
    logger.error("Unable to connect to server", error)
    process.exit(1)
  }
}

startServer()
