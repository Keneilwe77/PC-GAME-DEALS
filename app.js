"use strict";

const money = (amount) => `R${amount.toFixed(2)}`;

// A game is on sale only if its sale price is lower than its normal price.
function isOnSale(game) {
  return game.salePrice < game.normalPrice;
}

function getGamesOnSale(games) {
  return games.filter(isOnSale);
}

function getDiscountPercent(game) {
  if (game.normalPrice <= 0 || !isOnSale(game)) return 0;
  return Math.round(((game.normalPrice - game.salePrice) / game.normalPrice) * 100);
}

function getCurrentPrice(game) {
  return isOnSale(game) ? game.salePrice : game.normalPrice;
}

function getCheapestGame(games) {
  if (games.length === 0) return null;
  return games.reduce((cheapest, game) =>
    getCurrentPrice(game) < getCurrentPrice(cheapest) ? game : cheapest
  );
}

function searchGames(games, searchWord) {
  const query = searchWord.trim().toLowerCase();
  if (!query) return games;
  return games.filter((game) => game.title.toLowerCase().includes(query));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function renderGame(game) {
  const onSale = isOnSale(game);
  const current = getCurrentPrice(game);
  const initials = game.title.split(/\\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  return `<article class="game"><div class="top"><div class="icon" aria-hidden="true">${escapeHtml(initials)}</div>${onSale ? '<span class="badge">ON SALE</span>' : ""}</div>
    <h3>${escapeHtml(game.title)}</h3><div class="store">${escapeHtml(game.store)}</div>
    <div class="prices"><span class="current">${money(current)}</span>
    ${onSale ? `<span class="regular crossed">${money(game.normalPrice)}</span><span class="discount">${getDiscountPercent(game)}% OFF</span>` : '<span class="regular">regular price</span>'}</div>
    ${onSale ? "" : '<div class="nosale">Not currently discounted</div>'}</article>`;
}

function sortGames(games, sortBy) {
  const result = [...games];
  if (sortBy === "price-asc") return result.sort((a,b) => getCurrentPrice(a) - getCurrentPrice(b));
  if (sortBy === "discount-desc") return result.sort((a,b) => getDiscountPercent(b) - getDiscountPercent(a));
  if (sortBy === "title-asc") return result.sort((a,b) => a.title.localeCompare(b.title));
  return result;
}

async function startApp() {
  const $ = (selector) => document.querySelector(selector);
  let deals;
  try {
    const response = await fetch("./deals.json");
    if (!response.ok) throw new Error(`Could not load deals.json (HTTP ${response.status}).`);
    deals = await response.json();
    if (!Array.isArray(deals)) throw new Error("deals.json must contain a JSON array.");
  } catch (error) {
    $("#error").hidden = false;
    $("#error").textContent = `${error.message} Run a local web server; see README.md.`;
    $("#result-summary").textContent = "Game data could not be loaded.";
    return;
  }

  $("#sale-count").textContent = getGamesOnSale(deals).length;
  const cheapest = getCheapestGame(deals);
  $("#cheapest").textContent = cheapest ? `Cheapest: ${cheapest.title} · ${money(getCurrentPrice(cheapest))}` : "No games available";

  function updateView() {
    let visible = searchGames(deals, $("#search").value);
    if ($("#sale-only").checked) visible = visible.filter(isOnSale);
    visible = sortGames(visible, $("#sort").value);
    $("#games").innerHTML = visible.map(renderGame).join("");
    $("#empty").hidden = visible.length > 0;
    $("#result-summary").textContent = `${visible.length} of ${deals.length} games shown`;
  }
  $("#search").addEventListener("input", updateView);
  $("#sale-only").addEventListener("change", updateView);
  $("#sort").addEventListener("change", updateView);
  updateView();

  // Example Part A outputs appear in the browser developer console.
  console.log("Games on sale:", getGamesOnSale(deals).map(g => g.title));
  console.log('Search "hol":', searchGames(deals, "hol").map(g => g.title));
  console.log("Cheapest:", cheapest.title, money(getCurrentPrice(cheapest)));
  console.log("Hollow Knight discount:", getDiscountPercent(deals.find(g => g.title === "Hollow Knight")) + "%");
}
startApp();
