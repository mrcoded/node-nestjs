const logger = require('./logger');
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
})

const uploadMediaToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto"
      },
      (error, result) => {
        if (error) {
          logger.error("Cloudinary upload error", error)
          reject(error)
        } else {
          if (result) {
            resolve(result)
          }
        }
      }
    )

    uploadStream.end(file.buffer)
  })
}

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    logger.info("Media deleted successfully from cloudinary", publicId)
    return result
  } catch (error) {
    logger.error("Error in deleting media from cloudinary", error)
    throw Error
  }
}

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary }
