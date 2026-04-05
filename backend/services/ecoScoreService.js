const ecoKeywords = {
  // Materials
  "biodegradable": 20,
  "bamboo": 18,
  "organic": 15,
  "hemp": 15,
  "cotton": 8,
  "natural": 8,
  "wood": 6,
  "cork": 12,
  "jute": 12,
  "linen": 10,

  // Packaging & Waste
  "plastic free": 20,
  "plastic-free": 20,
  "zero waste": 20,
  "zero-waste": 20,
  "recyclable": 18,
  "recycled": 16,
  "compostable": 18,
  "reusable": 16,
  "refillable": 14,
  "packaging free": 15,
  "minimal packaging": 10,
  "no plastic": 18,

  // Certifications & Labels
  "eco friendly": 15,
  "eco-friendly": 15,
  "sustainable": 14,
  "green": 6,
  "vegan": 10,
  "cruelty free": 10,
  "cruelty-free": 10,
  "fair trade": 10,
  "non toxic": 12,
  "non-toxic": 12,
  "bpa free": 8,
  "bpa-free": 8,
  "chemical free": 10,
  "plant based": 12,
  "plant-based": 12,
  "ethically sourced": 10,
  "carbon neutral": 15,
  "energy efficient": 12,
  "solar": 10,
  "renewable": 12
};

function calculateEcoScore(description) {
  if (!description) return 0;

  let score = 0;
  const lowerDesc = description.toLowerCase();

  for (let keyword in ecoKeywords) {
    if (lowerDesc.includes(keyword)) {
      score += ecoKeywords[keyword];
    }
  }

  return Math.min(score, 100);
}

module.exports = { calculateEcoScore };