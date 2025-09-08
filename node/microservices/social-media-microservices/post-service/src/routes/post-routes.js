const express = require('express');
const { createPost, getAllPosts, getOnePost, deleteOnePost } = require("../controllers/post-controller")
const { authenticatedRequest } = require("../middleware/authMiddleware")

const router = express.Router();

//middleware => tell if the user is authenticated or not
router.use(authenticatedRequest)

//post routes
router.post("/create", createPost)
router.get("/get-all", getAllPosts)
router.get("/get/:id", getOnePost)
router.delete("/delete/:id", deleteOnePost)

module.exports = router