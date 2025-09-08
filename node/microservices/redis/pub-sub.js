// ->Publisher -> send -> channel -> subscriber will consume

const redis = require('redis');

const client = redis.createClient({
  host: "localhost",
  port: 6379
})

//Event listener
client.on("error", (error) => {
  console.log("Redis client error", error);
})

async function testAdditionFeatures() {
  try {
    //publisher
    await client.connect()
    //subscriber
    const subscriber = client.duplicate() //create a new client-> shares same connection
    await subscriber.connect() //connect to redis server for thte subscriber


    await subscriber.subscribe("dummy-channel", (message, channel) => {
      console.log(`Received message ${message} on channel ${channel}`);
    })

    //publish message to the dummy channel
    await client.publish("dummy-channel", "Show dummy data from publisher")
    await client.publish("dummy-channel", "Show new message again from publisher")

    await new Promise(resolve => setTimeout(resolve, 3000))
    //unsubscribe
    await subscriber.unsubscribe("dummy-channel")
    //close subscriber connection
    await subscriber.quit()

    //###############PIPELING & TRANSACTIONS###############
    // Pipeling is a way to execute multiple commands in a single request, without waiting for the results.
    //Transactions are a way to execute multiple commands in a single request,
    //  but in a way that ensures that all commands are executed atomically, without any partial execution.

    //Transaction
    const multi = client.multi()

    multi.set("key-transaction1", "value1")
    multi.set("key-transaction2", "value2")
    multi.get("key-transaction1")
    multi.get("key-transaction2")

    const results = await multi.exec()
    // console.log(results);

    //Pipeline
    const pipeline = client.multi()

    pipeline.set("key-pipeline1", "value1")
    pipeline.set("key-pipeline2", "value2")
    pipeline.get("key-pipeline1")
    pipeline.get("key-pipeline2")

    const results2 = await pipeline.exec()
    console.log(results2);

    //batch data operations
    const pipeline1 = client.multi()

    for (let i = 0; i < 10; i++) {
      pipeline.set(`key-pipeline1-${i}`, `value-${i}`)
    }

    await pipeline1.exec()

    const dummyExample = client.multi()
    dummyExample.decrBy("account:1234:balance", 100)
    dummyExample.incrBy("account:0000:balance", 100)

    const finalResult = await dummyExample.exec()
    console.log(finalResult)

    const cartExample = client.multi()
    multi.hIncrBy("cart:1234", "item_count", 1)
    multi.hIncrBy("cart:1234", "total_price", 10)
    await cartExample.exec()

    console.log("*************Performance test");
    console.time("without pipeling");
    for (let i = 0; i < 10; i++) {
      await client.set(`user-${i}`, `user_value-${i}`)
    }
    console.timeEnd("without pipeling");

    console.time("with pipeling");
    const bigPipeline = client.multi()

    for (let i = 0; i < 10; i++) {
      bigPipeline.set(`user_pipeline-${i}`, `user_pipeline_value-${i}`)
    }
    await bigPipeline.exec()

    console.timeEnd("with pipeling");
  } catch (error) {
    console.log(error)
  } finally {
    await client.quit()
  }
}

testAdditionFeatures()