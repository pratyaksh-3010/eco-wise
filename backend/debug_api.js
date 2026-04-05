require("dotenv").config();
const axios = require("axios");

async function test() {
  const options = {
    method: "GET",
    url: "https://real-time-product-search.p.rapidapi.com/search-v2",
    params: {
      q: "bamboo toothbrush eco friendly",
      country: "us",
      language: "en"
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "real-time-product-search.p.rapidapi.com"
    }
  };

  const response = await axios.request(options);
  console.log("STATUS:", response.data.status);
  console.log("KEYS:", Object.keys(response.data));
  
  if (response.data.data) {
    if (Array.isArray(response.data.data)) {
      console.log("data is ARRAY, length:", response.data.data.length);
      if (response.data.data.length > 0) {
        console.log("FIRST ITEM KEYS:", Object.keys(response.data.data[0]));
        console.log("FIRST ITEM:", JSON.stringify(response.data.data[0], null, 2));
      }
    } else if (typeof response.data.data === 'object') {
      console.log("data is OBJECT, keys:", Object.keys(response.data.data));
      // check for products inside
      for (const key of Object.keys(response.data.data)) {
        const val = response.data.data[key];
        if (Array.isArray(val) && val.length > 0) {
          console.log(`data.${key} is ARRAY, length:`, val.length);
          console.log(`FIRST ${key} ITEM KEYS:`, Object.keys(val[0]));
          console.log(`FIRST ${key} ITEM:`, JSON.stringify(val[0], null, 2));
        }
      }
    }
  }
}

test().catch(err => {
  console.error("Error:", err.message);
  if (err.response) console.log("Response data:", JSON.stringify(err.response.data));
});
