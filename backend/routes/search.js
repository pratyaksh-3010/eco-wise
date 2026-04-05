const express = require("express");
const router = express.Router();

const { searchProducts } = require("../services/productService");

router.post("/", async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: "Product name required" });
    }

    const result = await searchProducts(product);

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;