const redis = require('redis');

const client = redis.createClient({
  host: "localhost",
  port: 6379
})

//Event listener
client.on("error", (error) => {
  console.log("Redis client error", error);
})

async function redisDataStructure() {
  try {
    await client.connect()
    // string-> SET, GET, MSET- multiple set , MGET

    await client.set('user:name', "Coded Libra")
    const extractValue = await client.get('user:name')
    // console.log(extractValue)

    await client.mSet(["data:email", "coded@gmail.com", "data:age", "60", "data:country", "Naija"])
    const [email, age, country] = await client.mGet(["data:email", "data:age", "data:country"])
    // console.log(email, age, country)

    //##########lists -> 
    // LPUSH-insert wl at the begining of the list, RPUSH, 
    // LPOP= removes and returns the first element of the list, RPOP
    //  LRANGE
    // await client.lPush("notes", ["note 3"])
    // const notes = await client.lRange("notes", 0, -1) //re-aranges list
    // console.log(notes)

    // const firstNote = await client.lPop("notes")
    // console.log(firstNote)

    // const remainingNotes = await client.lRange("notes", 0, -1)
    // console.log(remainingNotes)

    //##############set ->
    //  SADD- add one/more member to a set,
    // SMEMBERS - returns all members of a set
    //SISMEMBER- checks if member exist in a set
    //SREM- removes one/more member from a set
    await client.sAdd("data:nickname", ["John", "Doe", "Mary", "Jane"])
    const extractUserNicknames = await client.sMembers("data:nickname")
    console.log(extractUserNicknames)

    const isJohnExist = await client.sIsMember("data:nickname", "John")
    console.log(isJohnExist)

    await client.sRem("data:nickname", "John")
    const remainingNicknames = await client.sMembers("data:nickname")
    console.log(remainingNicknames)

    //################sorted set -> 
    // ZADD- add one/more member to a sorted set
    // ZRANGE - range of el
    // ZREM- removes one/more member from a sorted set
    // ZRANK- returns the index of a member in a sorted set
    // ZSCORE- returns the score of a member in a sorted set
    // ZCARD- returns the number of members in a sorted set
    // ZREVRANGE- returns a range of members in a sorted set, with scores ordered from high to low
    await client.zAdd("cart", [{
      score: 100,
      value: "Product 1"
    }, {
      score: 200,
      value: "Product 2"
    }, {
      score: 300,
      value: "Product 3"
    }])

    const getProducts = await client.zRange("cart", 0, -1)
    console.log(getProducts)

    const extractAllCartProducts = await client.zRangeWithScores("cart", 0, -1)
    console.log(extractAllCartProducts)

    // const cartRank = await client.zRank("cart", "Product 2")
    // console.log(cartRank)

    //Hashes -> 
    //HGET, HSET, HGETALL, HDEL
    await client.hSet("user:1", {
      name: "John Doe",
      email: "johndoe@example.com",
      age: 40
    })

    const getProductRating = await client.hGet("user:1", "age")
    console.log(getProductRating)

    const getProductDetails = await client.hGetAll("user:1")
    console.log(getProductDetails)

    await client.hDel("user:1", "email")

    const updateProductDetails = await client.hGetAll("user:1")
    console.log(updateProductDetails)
  } catch (error) {
    console.log(error)
  } finally {
    client.quit()
  }
}

redisDataStructure()