const { calculateEcoScore } = require("./ecoScoreService");
const Product = require("../models/product");
const { fetchProducts } = require("./productApiServices");

async function searchProducts(productName) {

  // 1. Check cache in DB
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

  // 2. Fetch from API
  const products = await fetchProducts(productName);

  if (products.length === 0) {
    return {
      searchedProduct: productName,
      bestProduct: null,
      allProducts: [],
      cached: false
    };
  }

  // 3. Calculate eco score
  const scoredProducts = products.map(product => {
    const score = calculateEcoScore(product.description);

    return {
      searchedProduct: productName,
      name: product.name,
      description: product.description,
      price: product.price,
      ecoScore: score,
      buyLink: product.buyLink || null,
      store: product.store || null,
      rating: product.rating || null,
      image: product.image || null
    };
  });

  // 4. Save to DB (with upsert to avoid duplicates)
  for (const product of scoredProducts) {
    try {
      await Product.updateOne(
        {
          searchedProduct: product.searchedProduct,
          name: product.name
        },
        { $set: product },
        { upsert: true }
      );
    } catch (dbErr) {
      console.error("DB save error for product:", product.name, dbErr.message);
    }
  }

  // 5. Sort by eco score
  scoredProducts.sort((a, b) => b.ecoScore - a.ecoScore);

  return {
    searchedProduct: productName,
    bestProduct: scoredProducts[0] || null,
    allProducts: scoredProducts,
    cached: false
  };
}

module.exports = { searchProducts };