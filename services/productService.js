const { calculateEcoScore } = require("./ecoScoreService");
const Product= require("../models/product");

async function searchProducts(productName) {

  const products = [
    {
      name: "Plastic Toothbrush",
      description: "Standard plastic toothbrush",
      price: 20
    },
    {
      name: "Bamboo Toothbrush",
      description: "Biodegradable bamboo toothbrush, plastic free, compostable",
      price: 40
    },
    {
      name: "Recycled Plastic Toothbrush",
      description: "Made from recyclable material and reusable packaging",
      price: 35
    }
  ];

  const scoredProducts = [];

  for (let product of products) {
    const score = calculateEcoScore(product.description);

    const newProduct = new Product({
      searchedProduct: productName,
      name: product.name,
      description: product.description,
      price: product.price,
      ecoScore: score
    });

    await newProduct.save();

    scoredProducts.push({ ...product, ecoScore: score });
  }

  scoredProducts.sort((a, b) => b.ecoScore - a.ecoScore);

  return {
    searchedProduct: productName,
    bestProduct: scoredProducts[0],
    allProducts: scoredProducts
  };
}
module.exports = { searchProducts };