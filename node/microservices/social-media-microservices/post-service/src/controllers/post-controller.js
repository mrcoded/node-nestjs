const logger = require("../utils/logger")
const Post = require("../models/Post.model")
const { validateCreatePost } = require("../utils/validation")
const { publishEvent } = require("../utils/rabbitmq")

async function invalidatePostCache(req, input) {

  const cachedKey = `posts:${input}`
  await req.redisClient.del(cachedKey)

  const keys = await req.redisClient.keys(`posts:*`)
  if (keys.length > 0) {
    await req.redisClient.del(keys)
  }
}

const createPost = async (req, res) => {
  logger.info("Create post endpoint hit...")
  try {
    //validate the schema
    const { error } = validateCreatePost(req.body)
    if (error) {
      logger.warn("Validation Error", error.details[0].message)
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const { content, mediaIds } = req.body

    const newPost = new Post({
      content,
      user: req.user.userId,
      mediaIds: mediaIds || [],
    })

    await newPost.save()

    //publish post created event
    await publishEvent("post.created", {
      postId: newPost._id.toString(),
      userId: newPost.user.toString(),
      content: newPost.content,
      createdAt: newPost.createdAt
    })
    //invalidate post cache
    await invalidatePostCache(req, newPost._id.toString())

    logger.info("Post created successfully", newPost)
    res.status(201).json({
      success: true,
      message: "Post created successfully",
    })
  } catch (error) {
    logger.error("Error fetching post:", error)
    res.status(500).json({
      success: false,
      message: "Error creating post"
    })
  }
}

//Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit

    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);

    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)

    const totalNoOfPosts = await Post.countDocuments()

    const result = {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalNoOfPosts / limit),
      totalPosts: totalNoOfPosts,
    }

    //save post in redis cache
    await req.redisClient.set(
      cacheKey,
      JSON.stringify(result),
      "EX",
      300,
    )

    res.json(result)
  } catch (error) {
    logger.error("Error fetching post:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching all posts"
    })
  }
}

//Get a Post
const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id

    const cacheKey = `posts:${postId}`;
    const cachedPost = await req.redisClient.get(cacheKey);

    if (cachedPost) {
      return res.json(JSON.parse(cachedPost));
    }

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      })
    }

    //save post in redis cache
    await req.redisClient.set(
      cacheKey,
      JSON.stringify(post),
      "EX",
      3600,
    )

    res.json(post)
  } catch (error) {
    logger.error("Error fetching post:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching a post"
    })
  }
}

//Delete a Post
const deleteOnePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      })
    }

    //publish post delete event
    await publishEvent("post.deleted", {
      postId: post._id.toString(),
      userId: req.user.userId,
      mediaIds: post.mediaIds
    })

    //invalidate post cache
    await invalidatePostCache(req, req.params.id)
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    })
  } catch (error) {
    logger.error("Error fetching post:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting a post"
    })
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getOnePost,
  deleteOnePost
}