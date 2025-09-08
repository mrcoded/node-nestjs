const redis = require('redis');

const client = redis.createClient({
  host: "localhost",
  port: 6379
})

//Event listener
client.on("error", (error) => {
  console.log("Redis client error", error);
})

async function testRedisConnection() {
  try {
    await client.connect()
    console.log("Connected to redis")

    await client.set("name", "John Doe")

    const extractValue = await client.get("name")
    console.log(extractValue)

    const deleteCount = await client.del("name")
    console.log(deleteCount)

    await client.set("count", "100")
    const incrementCount = await client.incr("count")
    console.log(incrementCount)
  } catch (error) {
    console.log(error)
  } finally {
    await client.quit()
  }
}

testRedisConnection()