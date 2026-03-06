const axios = require("axios");

async function fetchProducts(productName) {
  try {

    const options = {
      method: "GET",
      url: "https://real-time-product-search.p.rapidapi.com/search",
      params: {
        query: productName,
        country: "us",
        language: "en"
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "real-time-product-search.p.rapidapi.com"
      }
    };

    // 🔹 API request
    const response = await axios.request(options);

    // 🔹 DEBUG: see full API response in terminal
    console.log("API RESPONSE:");
    console.log(response.data);

    // 🔹 Convert API data → our product format
    const products = response.data.data.slice(0,5).map(item => ({
      name: item.product_title,
      description: item.product_title,
      price: item.offer?.price || 0
    }));

    return products;

  } catch (error) {
    console.error("API Error:", error.message);
    return [];
  }
}

module.exports = { fetchProducts };