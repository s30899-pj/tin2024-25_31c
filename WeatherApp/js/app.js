//
//Switch cards
//
const cards = document.querySelectorAll('.card');
const navItems = document.querySelectorAll('footer li');

const hideAllCards = () => {
    cards.forEach(card => {
        card.classList.remove('active');
    });
};

const showCard = (cardId) => {
    hideAllCards();
    const card = document.getElementById(cardId);

    if (card) {
        card.classList.add('active');

        if (cardId === 'card-search') {
            const resultSection = card.querySelector('.result');
            const favoriteIcon = card.querySelector('.favorite-bth');
            if (resultSection) {
                resultSection.classList.remove('active');
            }
            if (favoriteIcon) {
                favoriteIcon.classList.remove('show');
            }
        }
    }
};


const activeNavLink = (navId) => {
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(navId).classList.add('active');
};

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const clickedId = e.target.closest('li').id;

        if (clickedId === 'nav-favorite') {
            showCard('card-favorite');
        } else if (clickedId === 'nav-search') {
            showCard('card-search');
        } else if (clickedId === 'nav-location') {
            showCard('card-location');
        } else if (clickedId === 'nav-map') {
            showCard('card-map');
            loadWeatherMapForLocation();
        } else if (clickedId === 'nav-alerts') {
            showCard('card-alerts');
        }

        activeNavLink(clickedId);
    });
});

showCard('card-location');
activeNavLink('nav-location');

//
//Nav-bar animation
//
const $list = document.querySelectorAll("footer li");

function activeLink() {
    $list.forEach(($li) => {
        $li.classList.remove("active")
    })
    this.classList.add("active");
}

$list.forEach(($li) => {
    $li.addEventListener(
        "click",
        activeLink,
    );
});

//
//Weather search initialization and support
//
let valueSearch = document.getElementById("valueSearch");

let city = document.getElementById("city");
let temperature = document.getElementById("temperature");
let description = document.querySelector(".description");
let clouds = document.getElementById("clouds");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");

let searchCity = document.getElementById("search-city");
let searchTemperature = document.getElementById("search-temperature");
let searchDescription = document.querySelector(".search-description");
let searchClouds = document.getElementById("search-clouds");
let searchHumidity = document.getElementById("search-humidity");
let searchPressure = document.getElementById("search-pressure");

let form = document.querySelector("form");
let main = document.querySelector("main");
let footer = document.querySelector("footer");

const updateWeatherUI = (data) => {
    const resultSection = document.querySelector('.result');
    const favoriteIcon = document.querySelector(".favorite-bth");
    const searchBar = document.querySelector('.search-bar');
    
    if (document.getElementById("card-search").classList.contains("active")) {
        searchCity.querySelector("figcaption").innerText = data.name;
        searchCity.querySelector("img").src = "https://flagsapi.com/" + data.sys.country + "/shiny/32.png";

        searchTemperature.querySelector("img").src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@4x.png";
        searchTemperature.querySelector("figcaption span").innerText = Math.round(data.main.temp) + "°C";
        searchDescription.innerText = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        searchClouds.innerText = data.clouds.all;
        searchHumidity.innerText = data.main.humidity;
        searchPressure.innerText = data.main.pressure;

        resultSection.classList.add('active');
        favoriteIcon.classList.add('show');
        searchBar.classList.add('active');
    } else {
        city.querySelector("figcaption").innerText = data.name;
        city.querySelector("img").src = "https://flagsapi.com/" + data.sys.country + "/shiny/32.png";

        temperature.querySelector("img").src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@4x.png";
        temperature.querySelector("figcaption span").innerText = Math.round(data.main.temp) + "°C";
        description.innerText = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        clouds.innerText = data.clouds.all;
        humidity.innerText = data.main.humidity;
        pressure.innerText = data.main.pressure;
    }
};



let apiKey = '';

const loadConfig = async () => {
    try {
        const response = await fetch('/tin2024-25_31c/WeatherApp/config/config.json');
        const data = await response.json();
        apiKey = data.apiKey;
        initApp();
    } catch (error) {
        console.error('Error loading configuration file:', error);
    }
};

const getWeatherUrl = () => `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}`;


const searchWeather = () => {
    const searchQuery = valueSearch.value.trim();

    if (searchQuery !== "") {
        fetch(`${getWeatherUrl()}&q=${searchQuery}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.cod === 200) {
                    updateWeatherUI(data);
                    updateFavoriteButtonForCity(data.name);
                } else {
                    main.classList.add("error");
                    footer.classList.add("error");
                    setTimeout(() => {
                        main.classList.remove("error");
                        footer.classList.remove("error")
                    }, 500);
                }
                valueSearch.value = "";
            });
    }
};

const initApp = () => {
    const activeCard = document.querySelector(".card.active");

    if (activeCard && activeCard.id === "card-search") {
        if (valueSearch.value) {
            searchWeather();
        }
    } else if (activeCard.id === "card-location") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    fetch(`${getWeatherUrl()}&lat=${latitude}&lon=${longitude}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.cod === 200) {
                                updateWeatherUI(data);
                            } else {
                                console.error("Error fetching weather for current location");
                            }
                        });
                },
                (error) => {
                    console.error(`Error occurred: ${error.message}`);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }
    valueSearch.value = "";
    resetFavoriteButton();
};

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (valueSearch.value !== "") {
        searchWeather();
    }
});

//
//Favorite function
//
let isFavorite = false;

const resetFavoriteButton = () => {
    favoriteButton.classList.remove('active');
    isFavorite = false;
};

const setFavoriteButtonActive = () => {
    favoriteButton.classList.add('active');
    isFavorite = true;
};

const isCityInFavorites = (cityName) => {
    const favoriteList = document.getElementById('favorite-list');
    return Array.from(favoriteList.children).some(li => {
        return li.querySelector('.favorite-city-name').textContent === cityName;
    });
};

function addFavorite(cityName) {
    const favoriteList = document.getElementById('favorite-list');

    if (isCityInFavorites(cityName)) {
        showNotification(`${cityName} is already in your favorites!`);
        return;
    }

    const li = document.createElement('li');
    const cityNameSpan = document.createElement('span');
    const removeButton = document.createElement('button');

    cityNameSpan.textContent = cityName;
    cityNameSpan.classList.add('favorite-city-name');

    removeButton.textContent = '×';
    removeButton.classList.add('favorite-city-remove');
    removeButton.onclick = function () {
        li.remove();
        resetFavoriteButton();
    };

    li.appendChild(cityNameSpan);
    li.appendChild(removeButton);
    favoriteList.appendChild(li);

    setFavoriteButtonActive();

    showCard('card-favorite');
    activeNavLink('nav-favorite');
}

function setCityFromFavorite(cityName) {
    valueSearch.value = cityName;
    searchWeather();
    showCard('card-search');
    activeNavLink('nav-search');
}

function updateFavoriteButtonForCity(cityName) {
    if (isCityInFavorites(cityName)) {
        setFavoriteButtonActive();
    } else {
        resetFavoriteButton();
    }
}

function removeCityFromFavorite(cityName) {
    const favoriteList = document.getElementById('favorite-list');

    const cityToRemove = Array.from(favoriteList.children).find(li => {
        return li.querySelector('.favorite-city-name').textContent === cityName;
    });
    if (cityToRemove) {
        cityToRemove.remove();
    }

    if (favoriteList.children.length === 0) {
        showCard('card-search');
        activeNavLink('nav-search');
    }

    resetFavoriteButton();
}

const favoriteButton = document.querySelector('.favorite-bth');
favoriteButton.addEventListener('click', () => {
    const cityName = searchCity.querySelector('figcaption').innerText;
    
    if (isFavorite) {
        const favoriteList = document.getElementById('favorite-list');
        const cityToRemove = Array.from(favoriteList.children).find(li => {
            return li.querySelector('.favorite-city-name').textContent === cityName;
        });
        if (cityToRemove) {
            cityToRemove.remove();
            resetFavoriteButton();
        }
    } else {
        addFavorite(cityName);
    }
});

document.getElementById('favorite-list').addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('favorite-city-remove')) {
        const cityName = e.target.closest('li').querySelector('.favorite-city-name').textContent;
        removeCityFromFavorite(cityName);
    } else if (e.target && e.target.closest('li')) {
        const cityName = e.target.closest('li').querySelector('.favorite-city-name').textContent;
        setCityFromFavorite(cityName);
    }
});

//
//Weather map genereation
//
let map;

const loadWeatherMapForLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                if (map) {
                    map.setView([latitude, longitude], 10);
                } else {
                    initWeatherMap(latitude, longitude);
                }
            },
            (error) => {
                console.error(`Location error: ${error.message}`);
                alert('Failed to retrieve location.');
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        alert('Geolocation is not available in this browser.');
    }
};

const initWeatherMap = (latitude, longitude) => {
    const leafletScript = document.createElement('script');
    leafletScript.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";

    leafletScript.onload = () => {
        map = L.map('weather-map', {
            zoomControl: false,
            maxBounds: [
                [-90, -180],
                [90, 180]
            ],
            maxBoundsViscosity: 1.0,
            minZoom: 3,
            maxZoom: 19
        }).setView([latitude, longitude], 10);

        const minimalBaseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        const temperatureLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors',
            maxZoom: 19,
            opacity: 0.7
        });

        const windLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors',
            maxZoom: 19,
            opacity: 0.7
        });

        const precipitationLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors',
            maxZoom: 19,
            opacity: 0.7
        });

        const cloudsLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors',
            maxZoom: 19,
            opacity: 0.7
        });

        const pressureLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors',
            maxZoom: 19,
            opacity: 0.7
        });

        const layers = {
            temperature: temperatureLayer,
            wind: windLayer,
            precipitation: precipitationLayer,
            clouds: cloudsLayer,
            pressure: pressureLayer
        };

        temperatureLayer.addTo(map);

        const tempLayerCheckbox = document.getElementById("tempLayer");
        if (tempLayerCheckbox) {
            tempLayerCheckbox.checked = true;
        }

        const windLayerCheckbox = document.getElementById("windLayer");
        const precipitationLayerCheckbox = document.getElementById("precipitationLayer");
        const cloudsLayerCheckbox = document.getElementById("cloudsLayer");
        const pressureLayerCheckbox = document.getElementById("pressureLayer");

        windLayerCheckbox.addEventListener("change", () => {
            if (windLayerCheckbox.checked) {
                windLayer.addTo(map);
            } else {
                windLayer.removeFrom(map);
            }
        });

        precipitationLayerCheckbox.addEventListener("change", () => {
            if (precipitationLayerCheckbox.checked) {
                precipitationLayer.addTo(map);
            } else {
                precipitationLayer.removeFrom(map);
            }
        });

        cloudsLayerCheckbox.addEventListener("change", () => {
            if (cloudsLayerCheckbox.checked) {
                cloudsLayer.addTo(map);
            } else {
                cloudsLayer.removeFrom(map);
            }
        });

        pressureLayerCheckbox.addEventListener("change", () => {
            if (pressureLayerCheckbox.checked) {
                pressureLayer.addTo(map);
            } else {
                pressureLayer.removeFrom(map);
            }
        });
        
        const hamburgerButton = document.getElementById("hamburgerButton");
        const layerControl = document.getElementById("layerControl");

        hamburgerButton.addEventListener("click", () => {
            hamburgerButton.classList.toggle("open");
            if (hamburgerButton.classList.contains("open")) {
                layerControl.style.display = "block";
            } else {
                layerControl.style.display = "none";
            }
        });

        fetchTemperatureAndAddMarker(latitude, longitude);
    };

    document.body.appendChild(leafletScript);
};

const addWeatherMarker = (latitude, longitude, temperature) => {
    const tempMarker = L.divIcon({
        className: 'custom-temp-marker',
        html: `<div class="temp-marker">
                   <div class="temp-circle">${Math.round(temperature)}&deg;C</div>
               </div>`,
    });

    L.marker([latitude, longitude], { icon: tempMarker }).addTo(map);
};

const fetchTemperatureAndAddMarker = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            addWeatherMarker(lat, lon, temperature);
        })
        .catch(error => console.error('Error fetching weather data:', error));
};

//
//Weather alerts system
//


loadConfig();