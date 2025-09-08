const logger = require("../utils/logger");
const Search = require("../models/Search.model");


const searchPostController = async (req, res) => {
  try {
    const { query } = req.query

    const cacheKey = `search:${query}`;
    const cachedPosts = await req.redisClient.get(cacheKey);
    logger.info("CacheKey", cacheKey)

    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const results = await Search.find({
      $text: { $search: query }
    },
      {
        score: { $meta: "textScore" }
      })
      .sort({ score: { $meta: "textScore" } })
      .limit(10)

    //save post in redis cache
    await req.redisClient.set(
      cacheKey,
      JSON.stringify(results),
      "EX",
      300,
    )

    res.status(200).json({
      success: true,
      message: "Search results",
      results,
    })
  } catch (error) {
    logger.error("Error in search post controller", error)
    res.status(500).json({
      success: false,
      message: "Error in search post controller",
      error: error.message,
      stack: error.stack
    })
  }
}

module.exports = { searchPostController }