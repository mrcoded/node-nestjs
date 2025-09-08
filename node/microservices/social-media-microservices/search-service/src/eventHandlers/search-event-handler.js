const logger = require('../utils/logger');
const redisClient = require('../utils/redis');
const Search = require('../models/Search.model');

async function invalidatePostCache(input) {

  const cachedKey = `search:${input}`
  await redisClient.del(cachedKey)

  const keys = await redisClient.keys(`search:*`);
  if (keys.length > 0) {
    await redisClient.del(keys)
  }
}

async function handlePostCreate(event) {
  try {
    const newSearchPost = new Search({
      postId: event.postId,
      userId: event.userId,
      content: event.content,
      createdAt: event.createdAt
    })

    await newSearchPost.save()

    //invalidate search post cache
    await invalidatePostCache(newSearchPost._id.toString())

    logger.info(`Search Post created: ${event.postId} ${newSearchPost._id.toString()}`)
  } catch (error) {
    logger.error("Error occured during post search creation", error)
  }
}

async function handlePostDelete(event) {
  try {
    const searchPost = await Search.findOneAndDelete({ postId: event.postId })

    if (searchPost) {
      await invalidatePostCache(event.postId);
      logger.info(`Search Post cache invalidated: ${event.postId}`);
    }

    //invalidate post cache
    await invalidatePostCache(searchPost?._id.toString())

    logger.info(`Search Post deleted: ${event.postId}`)
  } catch (error) {
    logger.error("Error occured during post search deletion", error)
  }
}

module.exports = { handlePostCreate, handlePostDelete }