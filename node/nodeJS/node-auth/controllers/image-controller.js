const fs = require('fs');
const Image = require('../models/Image.model');
const cloudinary = require('../config/cloudinary');
const uploadImageToCloudinary = require('../helpers/cloudinaryHelper');

const uploadImageController = async (req, res) => {
  try {
    //check if image is missing
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload a file"
      })
    }

    //upload image to cloudinary
    const image = req.file.path
    const { url, publicId } = await uploadImageToCloudinary(image)

    //save image url and publicId to database
    const newImage = new Image({
      url,
      publicId,
      uploadedBy: req.user.userId
    })

    //Save image
    await newImage.save()

    res.status(201).json({
      success: true,
      image: newImage,
      message: "Image uploaded successfully"
    })

    //delete the file from localstorage
    fs.unlinkSync(req.file.path)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })

  }
}

const fetchImagesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 1
    const skip = (page - 1) * limit
    //sort
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder || 'asc' ? 1 : -1
    //pagination
    const totalImages = await Image.countDocuments()
    const totalPages = Math.ceil(totalImages / limit)
    //sort
    const sortObj = {}
    sortObj[sortBy] = sortOrder

    //find images
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit)

    if (images) {
      res.status(200).json({
        success: true,
        totalImages,
        totalPages,
        currentPage: page,
        image: images,
        message: "Image fetched successfully"
      })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })

  }
}

const deleteImageController = async (req, res) => {
  try {
    //check if image
    const getCurrentImageID = req.params.id
    const userId = req.user.userId

    //find image
    const image = await Image.findById({ _id: getCurrentImageID })

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found"
      })
    }

    //check if image uploaded by user
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this image"
      })
    }

    //delete image from cloudinary
    await cloudinary.uploader.destroy(image.publicId)

    //delete image from database
    await Image.findByIdAndDelete(getCurrentImageID)

    res.status(200).json({
      success: true,
      image: image,
      message: "Image deleted successfully"
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })

  }
}

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController
}