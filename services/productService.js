const { calculateEcoScore } = require("./ecoScoreService");
const Product = require("../models/product");
const { fetchProducts } = require("./productApiServices");

async function searchProducts(productName) {

  // 1️⃣ Check cache in DB
  const existingProducts = await Product.find({
    searchedProduct: productName
  });

  if (existingProducts.length > 0) {
    console.log("Returning cached results from DB");

    existingProducts.sort((a, b) => b.ecoScore - a.ecoScore);

    return {
      searchedProduct: productName,
      bestProduct: existingProducts[0],
      allProducts: existingProducts,
      cached: true
    };
  }

  console.log("Fetching new data...");

 const products = await fetchProducts(productName);
  // 3️⃣ Calculate eco score
  const scoredProducts = products.map(product => {
    const score = calculateEcoScore(product.description);

    return {
      searchedProduct: productName,
      name: product.name,
      description: product.description,
      price: product.price,
      ecoScore: score
    };
  });

  // 4️⃣ Save to DB (with upsert to avoid duplicates)
  for (const product of scoredProducts) {
    await Product.updateOne(
      {
        searchedProduct: product.searchedProduct,
        name: product.name
      },
      { $set: product },
      { upsert: true }
    );
  }

  // 5️⃣ Sort by eco score
  scoredProducts.sort((a, b) => b.ecoScore - a.ecoScore);

  return {
    searchedProduct: productName,
    bestProduct: scoredProducts[0],
    allProducts: scoredProducts,
    cached: false
  };
}

module.exports = { searchProducts };