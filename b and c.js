
"use strict";

let games = [];

const gameList = document.getElementById("game-list");
const searchInput = document.getElementById("search");
const saleOnlyInput = document.getElementById("sale-only");
const sortSelect = document.getElementById("sort");
const resultsMessage = document.getElementById("results-message");
const errorMessage = document.getElementById("error-message");

function isOnSale(game) {
    return game.salePrice < game.normalPrice;
}

function getCurrentPrice(game) {
    return isOnSale(game) ? game.salePrice : game.normalPrice;
}

function calculateDiscount(game) {
    if (!isOnSale(game) || game.normalPrice <= 0) {
        return 0;
    }

    return Math.round(
        ((game.normalPrice - game.salePrice) / game.normalPrice) * 100
    );
}

function formatPrice(price) {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR"
    }).format(price);
}

function getCheapestGame(gameList) {
    if (gameList.length === 0) {
        return null;
    }

    return gameList.reduce((cheapest, game) => {
        return getCurrentPrice(game) < getCurrentPrice(cheapest)
            ? game
            : cheapest;
    });
}

function updateSummary() {
    document.getElementById("game-count").textContent = games.length;

    const saleCount = games.filter(isOnSale).length;
    document.getElementById("sale-count").textContent = saleCount;

    const cheapest = getCheapestGame(games);
    document.getElementById("cheapest-game").textContent = cheapest
        ? `${cheapest.title} (${formatPrice(getCurrentPrice(cheapest))})`
        : "None";
}

function createGameCard(game) {
    const card = document.createElement("article");
    card.className = "game-card";

    const title = document.createElement("h2");
    title.textContent = game.title;
    card.appendChild(title);

    const store = document.createElement("p");
    store.className = "store";
    store.textContent = `Store: ${game.store}`;
    card.appendChild(store);

    const normalRow = document.createElement("div");
    normalRow.className = "price-row";

    const normalLabel = document.createElement("span");
    normalLabel.textContent = "Normal price";

    const normalValue = document.createElement("span");
    normalValue.className = isOnSale(game) ? "old-price" : "price";
    normalValue.textContent = formatPrice(game.normalPrice);

    normalRow.append(normalLabel, normalValue);
    card.appendChild(normalRow);

    if (isOnSale(game)) {
        const saleRow = document.createElement("div");
        saleRow.className = "price-row";

        const saleLabel = document.createElement("span");
        saleLabel.textContent = "Sale price";

        const saleValue = document.createElement("span");
        saleValue.className = "price sale-price";
        saleValue.textContent = formatPrice(game.salePrice);

        saleRow.append(saleLabel, saleValue);
        card.appendChild(saleRow);

        const tag = document.createElement("span");
        tag.className = "sale-tag";
        tag.textContent = `ON SALE · ${calculateDiscount(game)}% OFF`;
        card.appendChild(tag);

        const saving = document.createElement("p");
        saving.className = "saving";
        saving.textContent =
            `You save ${formatPrice(game.normalPrice - game.salePrice)}`;
        card.appendChild(saving);
    }

    return card;
}

function renderGames() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const onlySales = saleOnlyInput.checked;
    const sortBy = sortSelect.value;

    let filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm);
        const matchesSale = !onlySales || isOnSale(game);

        return matchesSearch && matchesSale;
    });

    if (sortBy === "price") {
        filteredGames.sort(
            (a, b) => getCurrentPrice(a) - getCurrentPrice(b)
        );
    } else if (sortBy === "discount") {
        filteredGames.sort(
            (a, b) => calculateDiscount(b) - calculateDiscount(a)
        );
    } else if (sortBy === "title") {
        filteredGames.sort((a, b) => a.title.localeCompare(b.title));
    }

    gameList.replaceChildren();

    filteredGames.forEach(game => {
        gameList.appendChild(createGameCard(game));
    });

    resultsMessage.textContent =
        `Showing ${filteredGames.length} of ${games.length} games.`;

    if (filteredGames.length === 0) {
        resultsMessage.textContent += " Try a different search.";
    }
}

async function loadGames() {
    try {
        const response = await fetch("deals.json");

        if (!response.ok) {
            throw new Error("Could not load the game data.");
        }

        games = await response.json();

        updateSummary();
        renderGames();
    } catch (error) {
        errorMessage.textContent =
            "Unable to load games. Please run the project using a local web server.";
        resultsMessage.textContent = "";
        console.error(error);
    }
}

searchInput.addEventListener("input", renderGames);
saleOnlyInput.addEventListener("change", renderGames);
sortSelect.addEventListener("change", renderGames);

loadGames();
