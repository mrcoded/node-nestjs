const cloudinary = require('cloudinary');

const uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath)

    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.log("Error in uploading image", error)
    throw new Error("Error in uploading image")
  }
};

module.exports = uploadImageToCloudinary