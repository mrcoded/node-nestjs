const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
  inStock: Boolean,
});

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
