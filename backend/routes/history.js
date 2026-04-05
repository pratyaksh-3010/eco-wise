const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.get("/", async (req, res) => {
  const history = await Product.find().sort({ createdAt: -1 });
  res.json(history);
});

module.exports = router;