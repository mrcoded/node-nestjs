const express = require('express');
const multer = require('multer');
const logger = require('./../utils/logger');
const { authenticatedRequest } = require('../middleware/authMiddleware');
const { uploadMedia, getAllMedias } = require('../controllers/media-controller')

const router = express.Router();

//configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 //5MB file size
  }
}).single('file');


//upload routes
router.post('/upload', authenticatedRequest, (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      logger.error("Mutler upload error", err)
      return res.status(400).json({
        success: false,
        message: "Multer upload error ",
        error: err.message,
        stack: err.stack
      })
    } else if (err) {
      logger.error("Unknown error occured while uploading media", err)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
        stack: err.stack
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload a file"
      })
    }

    next()
  })
}, uploadMedia)

//get routes
router.get("/get", authenticatedRequest, getAllMedias)

module.exports = router