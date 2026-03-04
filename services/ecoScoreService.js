const ecoKeywords = {
  biodegradable: 25,
  recyclable: 20,
  organic: 15,
  "plastic free": 20,
  bamboo: 20,
  reusable: 15,
  compostable: 20
};

function calculateEcoScore(description) {
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