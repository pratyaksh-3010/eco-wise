const axios = require("axios");

function extractPrice(item) {
  // Try the offer price first (most reliable in v2 response)
  if (item.offer && item.offer.price) {
    const p = parseFloat(String(item.offer.price).replace(/[^0-9.]/g, ""));
    if (!isNaN(p)) return p;
  }
  if (item.typical_price_range && item.typical_price_range.length > 0) {
    const p = parseFloat(String(item.typical_price_range[0]).replace(/[^0-9.]/g, ""));
    if (!isNaN(p)) return p;
  }
  if (item.price) {
    const p = parseFloat(String(item.price).replace(/[^0-9.]/g, ""));
    if (!isNaN(p)) return p;
  }
  if (item.extracted_price) {
    return item.extracted_price;
  }
  return 0;
}

function buildDescription(item) {
  // Build a rich description from all available fields for eco scoring
  const parts = [];

  if (item.product_description) {
    parts.push(item.product_description);
  }

  if (item.product_title) {
    parts.push(item.product_title);
  }

  // Product attributes often contain eco-relevant keywords
  if (item.product_attributes && typeof item.product_attributes === "object") {
    for (const [key, value] of Object.entries(item.product_attributes)) {
      parts.push(`${key}: ${value}`);
    }
  }

  // Offer title may also contain useful keywords
  if (item.offer && item.offer.offer_title) {
    parts.push(item.offer.offer_title);
  }

  return parts.join(" | ");
}

function extractBuyLink(item) {
  // Get the best purchase URL
  if (item.offer && item.offer.offer_page_url) {
    return item.offer.offer_page_url;
  }
  if (item.product_page_url) {
    return item.product_page_url;
  }
  return null;
}

function extractStoreName(item) {
  if (item.offer && item.offer.store_name) {
    return item.offer.store_name;
  }
  return null;
}

function extractRating(item) {
  return item.product_rating || null;
}

function extractImage(item) {
  if (item.product_photos && item.product_photos.length > 0) {
    return item.product_photos[0];
  }
  return null;
}

async function fetchProducts(productName) {
  try {
    const options = {
      method: "GET",
      url: "https://real-time-product-search.p.rapidapi.com/search-v2",
      params: {
        q: `${productName} eco friendly`,
        country: "us",
        language: "en"
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "real-time-product-search.p.rapidapi.com"
      }
    };

    const response = await axios.request(options);

    console.log("API RESPONSE STATUS:", response.status);

    // Handle the v2 API response structure:
    // response.data.data can be:
    //   - An object with a "products" array (v2 search-v2)
    //   - A direct array (older versions)
    let rawProducts = [];

    if (response.data && response.data.data) {
      if (Array.isArray(response.data.data)) {
        // Direct array (legacy format)
        rawProducts = response.data.data;
      } else if (response.data.data.products && Array.isArray(response.data.data.products)) {
        // Object with products array (current v2 format)
        rawProducts = response.data.data.products;
      }
    }

    if (rawProducts.length === 0) {
      console.log("No products returned from API");
      return [];
    }

    const products = rawProducts.slice(0, 8).map(item => ({
      name: item.product_title || "Unknown Product",
      description: buildDescription(item),
      price: extractPrice(item),
      buyLink: extractBuyLink(item),
      store: extractStoreName(item),
      rating: extractRating(item),
      image: extractImage(item)
    }));

    console.log(`Parsed ${products.length} products`);
    return products;

  } catch (error) {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", JSON.stringify(error.response.data));
    }
    return [];
  }
}

module.exports = { fetchProducts };