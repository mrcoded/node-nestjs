const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mediaIds: [
    {
      type: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

//different service for search
postSchema.index({ content: "text" })

const Post = mongoose.model('Post', postSchema);

module.exports = Post