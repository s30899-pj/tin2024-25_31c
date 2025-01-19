const apiUrl = "https://szuflandia.pjwstk.edu.pl/~ppisarski/zad8/dane.php";
let previousStockData = {};
let newsQueue = [];
let currentNewsIndex = 0;
let isTransitioning = false;
let rotateInterval;

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        updateStocks(data.stock);
        updateNews(data.news);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateStocks(stockData) {
    const stockTable = document.getElementById("stock-data");
    stockTable.innerHTML = "";

    for (const [company, price] of Object.entries(stockData)) {
        const previousPrice = previousStockData[company] || price;
        let changeClass = "";
        let changeSymbol = "-";

        if (price > previousPrice) {
            changeClass = "up";
            changeSymbol = "▲";
        } else if (price < previousPrice) {
            changeClass = "down";
            changeSymbol = "▼";
        }

        const row = `<tr>
          <td>${company}</td>
          <td>${price}</td>
          <td class="${changeClass}">${changeSymbol}</td>
        </tr>`;

        stockTable.insertAdjacentHTML("beforeend", row);
        previousStockData[company] = price;
    }
}

function updateNews(newNews) {
    newsQueue.push(newNews);

    if (newsQueue.length > 3) {
        newsQueue.shift();
    }

    currentNewsIndex = newsQueue.length - 1;

    renderNews();

    resetRotateNewsInterval();
}

function renderNews() {
    const newsRotator = document.getElementById("news-rotator");
    const newsIndicator = document.getElementById("news-indicator");

    newsRotator.innerHTML = "";
    newsIndicator.innerHTML = "";
    
    newsQueue.forEach((news, index) => {
        const newsItem = `<div class="news-item ${index === currentNewsIndex ? "active" : ""}">
          ${news}
        </div>`;
        newsRotator.insertAdjacentHTML("beforeend", newsItem);

        const indicator = `<span class="${index === currentNewsIndex ? "active" : ""}" onclick="showNews(${index})"></span>`;
        newsIndicator.insertAdjacentHTML("beforeend", indicator);
    });
}

function rotateNews() {
    if (isTransitioning || newsQueue.length === 0) return;

    const newsItems = document.querySelectorAll(".news-item");
    const indicators = document.querySelectorAll(".indicator span");

    newsItems[currentNewsIndex].classList.remove("active");
    indicators[currentNewsIndex].classList.remove("active");

    currentNewsIndex = (currentNewsIndex + 1) % newsQueue.length;

    newsItems[currentNewsIndex].classList.add("active");
    indicators[currentNewsIndex].classList.add("active");

    isTransitioning = true;

    setTimeout(() => {
        isTransitioning = false;
    }, 3333);
}

function showNews(index) {
    currentNewsIndex = index;
    renderNews();
}

function resetRotateNewsInterval() {
    if (rotateInterval) {
        clearInterval(rotateInterval);
    }

    rotateInterval = setInterval(rotateNews, 5000);
}

setInterval(fetchData, 15000);

fetchData();
