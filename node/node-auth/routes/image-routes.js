const express = require('express');
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/upload-middleware')
const {
  uploadImageController,
  fetchImagesController,
  deleteImageController
} = require('../controllers/image-controller');

//create express router
const router = express.Router();

//upload image route
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
)

//Get all images route
router.get("/all", authMiddleware, fetchImagesController)

//Delete image route
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteImageController
)

module.exports = router