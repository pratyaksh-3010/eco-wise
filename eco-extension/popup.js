document.getElementById("searchBtn").addEventListener("click", handleSearch);
document.getElementById("productInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

async function handleSearch() {
  const product = document.getElementById("productInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!product) {
    resultDiv.innerHTML = '<p class="error">Please enter a product name</p>';
    return;
  }

  resultDiv.innerHTML = '<div class="loading"><span class="spinner"></span> Searching for eco-friendly alternatives...</div>';

  try {
    const response = await fetch("http://localhost:5000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ product })
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();

    if (data.bestProduct) {
      let html = renderBestProduct(data.bestProduct);

      if (data.allProducts && data.allProducts.length > 1) {
        html += `<h3 class="other-title">Other Alternatives</h3>`;
        html += '<div class="product-list">';
        data.allProducts.slice(1).forEach((p, i) => {
          html += renderProductCard(p, i);
        });
        html += '</div>';
      }

      if (data.cached) {
        html += '<p class="cached-note">📦 Results from cache</p>';
      }

      resultDiv.innerHTML = html;
    } else {
      resultDiv.innerHTML = '<p class="error">No eco-friendly products found. Try a different search.</p>';
    }
  } catch (error) {
    console.error("Extension error:", error);
    resultDiv.innerHTML = '<p class="error">⚠️ Could not connect to server. Make sure the backend is running on port 5000.</p>';
  }
}

function getEcoScoreColor(score) {
  if (score >= 70) return "#4caf50";
  if (score >= 40) return "#ff9800";
  return "#f44336";
}

function getEcoScoreLabel(score) {
  if (score >= 70) return "Excellent";
  if (score >= 40) return "Good";
  if (score >= 20) return "Fair";
  return "Low";
}

function renderStars(rating) {
  if (!rating) return '';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '⭐'.repeat(full) + (half ? '✨' : '') + `<span class="rating-num">${rating}</span>`;
}

function renderBestProduct(p) {
  const scoreColor = getEcoScoreColor(p.ecoScore);
  const scoreLabel = getEcoScoreLabel(p.ecoScore);
  
  return `<div class="best-product">
    <div class="best-badge">🏆 Best Eco Alternative</div>
    ${p.image ? `<div class="product-image-wrap"><img src="${p.image}" alt="${p.name}" class="product-image" /></div>` : ''}
    <p class="product-name">${p.name}</p>
    <div class="product-meta">
      <div class="eco-score-wrap">
        <div class="eco-score-bar">
          <div class="eco-score-fill" style="width: ${p.ecoScore}%; background: ${scoreColor};"></div>
        </div>
        <span class="eco-score-text" style="color: ${scoreColor};">🌱 ${p.ecoScore}/100 · ${scoreLabel}</span>
      </div>
      <div class="meta-row">
        <span class="price">${p.price > 0 ? '💲 $' + p.price.toFixed(2) : '💲 Price N/A'}</span>
        ${p.store ? `<span class="store">🏪 ${p.store}</span>` : ''}
        ${p.rating ? `<span class="rating">${renderStars(p.rating)}</span>` : ''}
      </div>
    </div>
    ${p.buyLink ? `<a href="${p.buyLink}" target="_blank" class="buy-btn" id="buyBestProduct">🛒 View Product</a>` : ''}
  </div>`;
}

function renderProductCard(p, index) {
  const scoreColor = getEcoScoreColor(p.ecoScore);
  const scoreLabel = getEcoScoreLabel(p.ecoScore);

  return `<div class="product-card" style="animation-delay: ${index * 0.08}s">
    <div class="card-content">
      ${p.image ? `<img src="${p.image}" alt="${p.name}" class="card-thumb" />` : ''}
      <div class="card-info">
        <p class="product-name">${p.name}</p>
        <div class="product-meta">
          <span class="eco-score-text" style="color: ${scoreColor};">🌱 ${p.ecoScore}/100</span>
          <span class="price">${p.price > 0 ? '$' + p.price.toFixed(2) : 'N/A'}</span>
          ${p.store ? `<span class="store-small">${p.store}</span>` : ''}
        </div>
      </div>
    </div>
    ${p.buyLink ? `<a href="${p.buyLink}" target="_blank" class="buy-link" id="buyProduct${index}">View →</a>` : ''}
  </div>`;
}