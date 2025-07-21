const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book Title is required"],
    trim: true,
    maxLength: [50, "Title must be less than 50 characters"]
  },
  author: {
    type: String,
    required: [true, "Book Author is required"],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, "Publication Year is required"],
    min: [1000, "Year must be at least than 1000"],
    max: [new Date().getFullYear(), "Year must be in the future"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Book", bookSchema)