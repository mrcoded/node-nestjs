const amqp = require('amqplib');
const logger = require('./logger');

let connection = null
let channel = null

const EXCHANGE_NAME = "facebook_events"

async function connectRabbitMq() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL)
    channel = await connection.createChannel()

    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false })
    logger.info("Connected to RabbitMQ...")

    return channel
  } catch (error) {
    logger.error("Error connecting to rabbitMQ", error)
  }
}

// async function publishEvent(routingKey, message) {
//   if (!channel) {
//     await connectRabbitMq()
//   }

//   channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)))
//   logger.info(`Event published to ${routingKey}`)
// }

async function publishEvent(routingKey, message) {
  if (typeof message !== "object") {
    throw new Error("Message must be a valid object to be JSON.stringified")
  }

  if (!channel) {
    await connectRabbitMq();
  }

  const payload = JSON.stringify(message)
  channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(payload))
  logger.info(`Events published to ${routingKey}`)
}

module.exports = { connectRabbitMq, publishEvent }