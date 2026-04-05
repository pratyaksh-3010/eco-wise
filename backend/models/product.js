const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  searchedProduct: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  price: Number,
  ecoScore: Number,
  buyLink: String,
  store: String,
  rating: Number,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate same product under same search
productSchema.index({ searchedProduct: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);