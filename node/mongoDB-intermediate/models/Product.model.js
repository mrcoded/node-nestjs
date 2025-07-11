const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  inStock: Boolean,
  tag: [String],
})

module.exports = mongoose.model("Product", ProductSchema)