const logger = require("../utils/logger")
const Media = require("../models/Media.model")
const { deleteMediaFromCloudinary } = require("../utils/cloudinary")

const handlePostDeleted = async (event) => {
  console.log(`Post deleted with id`, event)
  const { postId, mediaIds } = event

  try {

    const mediaToDelete = await Media.find({ _id: { $in: mediaIds } })

    for (const media of mediaToDelete) {
      await deleteMediaFromCloudinary(media.publicId)
      await Media.findByIdAndDelete(media._id)

      logger.info(`Media ${media._id} deleted for post ${postId} successfully`)
    }

    logger.info(`Media deleted for post ${postId} successfully`)
  } catch (error) {
    logger.error("Error occured during media deletion", error)
  }
}

module.exports = { handlePostDeleted }