require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const mediaRoutes = require('./routes/media-routes')
const errorHandler = require('./middleware/errorHandler');
const { connectRabbitMq, consumeEvent } = require("./utils/rabbitmq");
const { handlePostDeleted } = require("./eventHandlers/media-event-handlers");

const app = express();
const PORT = process.env.PORT || 3003;

//connect to mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to mongoDb"))
  .catch((e) => logger.error("Mongo connection error", e))

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use((req, res, next) => {
  logger.info(`Recieved ${req.method} request to ${req.url}`)
  logger.info(`Request body, ${req.body}`)
  next()
})

//***Implement rate limiting 

//routes
app.use('/api/media', mediaRoutes)

//error handler
app.use(errorHandler)

async function startServer() {
  try {
    await connectRabbitMq()

    //consume all the events
    await consumeEvent("post.deleted", handlePostDeleted)

    app.listen(PORT, () => {
      logger.info(`Media service running on port ${PORT}`)
    })
  } catch (error) {
    logger.error("Unable to connect to server", error)
    process.exit(1)
  }
}

startServer()
