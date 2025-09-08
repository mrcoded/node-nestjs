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

async function consumeEvent(routingKey, callback) {
  if (!channel) {
    await connectRabbitMq()
  }

  const q = await channel.assertQueue("", { exclusive: true })
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey)
  channel.consume(q.queue, (message) => {
    if (message !== null) {
      try {
        const content = JSON.parse(message.content.toString());
        callback(content);
      } catch (error) {
        logger.error("Error consuming event", error);
      }
      channel.ack(message);
    }
  })

  logger.info(`Subscribed to ${routingKey}`)
}

module.exports = { connectRabbitMq, consumeEvent }