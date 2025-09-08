const mongoose = require('mongoose');

const searchPostSchema = new mongoose.Schema({
  postId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: String,
    index: true,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

searchPostSchema.index({ content: "text" })
searchPostSchema.index({ createdAt: -1 })

const Search = mongoose.model('Search', searchPostSchema);

module.exports = Search