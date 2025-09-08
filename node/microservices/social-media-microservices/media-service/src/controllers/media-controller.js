const logger = require('../utils/logger');
const Media = require('../models/Media.model');
const { uploadMediaToCloudinary } = require('../utils/cloudinary');

const uploadMedia = async (req, res) => {
  logger.info("Upload media starting...")
  try {
    if (!req.file) {
      logger.warn("No file uploaded. Please upload a file")
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload a file"
      })
    }

    const { originalname, mimetype, buffer } = req.file
    const userId = req.user.userId

    logger.info(`File uploaded:, name=${originalname}, type=${mimetype}`)
    logger.info("Uploading media to cloudinary...")

    const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file)
    logger.info(`Cloudinary upload successfully, Public Id: ${cloudinaryUploadResult.public_id}`)

    if (!cloudinaryUploadResult) {
      logger.error("Cloudinary upload failed")
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed"
      })
    }

    const { public_id, secure_url } = cloudinaryUploadResult

    const newMedia = new Media({
      url: secure_url,
      publicId: public_id,
      userId,
      originalName: originalname,
      mimeType: mimetype
    })

    await newMedia.save()

    res.status(201).json({
      success: true,
      mediaId: newMedia._id,
      url: secure_url,
      message: "Media uploaded successfully",
    })
  } catch (error) {
    logger.error("Error uploading media", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

const getAllMedias = async (req, res) => {
  try {
    const results = await Media.find({})
    res.json({ results })
  } catch (error) {
    logger.error("Error fetching media", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

module.exports = { uploadMedia, getAllMedias }