const valueSearchInput = document.getElementById("valueSearch");

valueSearchInput.addEventListener("input", () => {
    const currentValue = valueSearchInput.value;
    if (currentValue.length > 0) {
        valueSearchInput.value = currentValue.charAt(0).toUpperCase() + currentValue.slice(1);
    }
});

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

        if (cardId === 'card-map') {
            loadWeatherMapForLocation();
        }

        if (cardId === 'card-alerts') {
            loadWeatherAlerts();
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
//Weather map generation
//
let map;

const setupHamburgerMenu = () => {
    const hamburgerButton = document.getElementById("hamburgerButton");
    const layerControl = document.getElementById("layerControl");

    if (hamburgerButton) {
        hamburgerButton.addEventListener("click", () => {
            hamburgerButton.classList.toggle("open");
            if (hamburgerButton.classList.contains("open")) {
                layerControl.style.display = "block";
            } else {
                layerControl.style.display = "none";
            }
        });
    }

    const closeHamburgerMenu = () => {
        if (hamburgerButton && hamburgerButton.classList.contains("open")) {
            hamburgerButton.classList.remove("open");
            layerControl.style.display = "none";
        }
    };

    const tempLayerCheckbox = document.getElementById("tempLayer");
    const windLayerCheckbox = document.getElementById("windLayer");
    const precipitationLayerCheckbox = document.getElementById("precipitationLayer");
    const cloudsLayerCheckbox = document.getElementById("cloudsLayer");
    const pressureLayerCheckbox = document.getElementById("pressureLayer");

    const onLayerChange = () => {
        closeHamburgerMenu();
    };

    if (tempLayerCheckbox) tempLayerCheckbox.addEventListener("change", onLayerChange);
    if (windLayerCheckbox) windLayerCheckbox.addEventListener("change", onLayerChange);
    if (precipitationLayerCheckbox) precipitationLayerCheckbox.addEventListener("change", onLayerChange);
    if (cloudsLayerCheckbox) cloudsLayerCheckbox.addEventListener("change", onLayerChange);
    if (pressureLayerCheckbox) pressureLayerCheckbox.addEventListener("change", onLayerChange);
};


const loadWeatherMapForLocation = () => {
    const cardMap = document.getElementById('card-map');
    const isCardMapActive = cardMap && cardMap.classList.contains('active');

    if (isCardMapActive) {
        if (map) {
            map.remove();
            map = null;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    initWeatherMap(latitude, longitude);
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
    }
};

setupHamburgerMenu();

const initWeatherMap = (latitude, longitude) => {
    const leafletScript = document.createElement('script');
    leafletScript.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";

    leafletScript.onload = () => {
        if (map) {
            map.remove();
        }

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
            opacity: 0.8
        });

        const windLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors',
            maxZoom: 19,
            opacity: 0.8
        });

        const precipitationLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors',
            maxZoom: 19,
            opacity: 0.8
        });

        const cloudsLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors',
            maxZoom: 19,
            opacity: 0.8
        });

        const pressureLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors',
            maxZoom: 19,
            opacity: 0.8
        });

        const layers = {
            temperature: temperatureLayer,
            wind: windLayer,
            precipitation: precipitationLayer,
            clouds: cloudsLayer,
            pressure: pressureLayer
        };

        temperatureLayer.addTo(map);

        const changeLayer = (selectedLayer) => {
            Object.values(layers).forEach(layer => map.removeLayer(layer));
            if (layers[selectedLayer]) layers[selectedLayer].addTo(map);
        };

        const updateCheckboxes = (selectedCheckbox) => {
            const checkboxes = document.querySelectorAll("#layerControl input[type='checkbox']");
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            selectedCheckbox.checked = true;
        };

        const tempLayerCheckbox = document.getElementById("tempLayer");
        const windLayerCheckbox = document.getElementById("windLayer");
        const precipitationLayerCheckbox = document.getElementById("precipitationLayer");
        const cloudsLayerCheckbox = document.getElementById("cloudsLayer");
        const pressureLayerCheckbox = document.getElementById("pressureLayer");

        if (tempLayerCheckbox) tempLayerCheckbox.checked = true;
        if (windLayerCheckbox) windLayerCheckbox.checked = false;
        if (precipitationLayerCheckbox) precipitationLayerCheckbox.checked = false;
        if (cloudsLayerCheckbox) cloudsLayerCheckbox.checked = false;
        if (pressureLayerCheckbox) pressureLayerCheckbox.checked = false;

        tempLayerCheckbox.addEventListener("change", () => {
            if (tempLayerCheckbox.checked) {
                updateCheckboxes(tempLayerCheckbox);
                changeLayer('temperature');
            }
        });

        windLayerCheckbox.addEventListener("change", () => {
            if (windLayerCheckbox.checked) {
                updateCheckboxes(windLayerCheckbox);
                changeLayer('wind');
            }
        });

        precipitationLayerCheckbox.addEventListener("change", () => {
            if (precipitationLayerCheckbox.checked) {
                updateCheckboxes(precipitationLayerCheckbox);
                changeLayer('precipitation');
            }
        });

        cloudsLayerCheckbox.addEventListener("change", () => {
            if (cloudsLayerCheckbox.checked) {
                updateCheckboxes(cloudsLayerCheckbox);
                changeLayer('clouds');
            }
        });

        pressureLayerCheckbox.addEventListener("change", () => {
            if (pressureLayerCheckbox.checked) {
                updateCheckboxes(pressureLayerCheckbox);
                changeLayer('pressure');
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
const checkWeatherAlerts = (data) => {
    const alertsList = document.getElementById('alerts-list');
    alertsList.innerHTML = '';

    let alertsAdded = false;

    const currentHour = new Date().getHours();

    if (data.main.temp < 0) {
        createAlert('alert-temp-below-zero', 'Warning: The temperature has dropped below zero!');
        alertsAdded = true;
    }

    if (data.main.temp > 30) {
        createAlert('alert-temp-above-30', 'The temperature has risen above 30°C. Remember to stay hydrated!');
        alertsAdded = true;
    }

    if (data.wind.speed > 27.8) {
        createAlert('alert-wind', 'Alert: Winds are stronger than 100 km/h!');
        alertsAdded = true;
    }

    if (data.weather.some(weather => weather.main === 'Rain')) {
        createAlert('alert-rain', 'Warning: Heavy rain is forecasted.');
        if (data.weather.some(weather => weather.main === 'Rain' && weather.description === 'heavy rain')) {
            createAlert('alert-rain-now', 'It’s raining right now, take an umbrella!');
        }
        alertsAdded = true;
    }

    if (data.weather.some(weather => weather.main === 'Thunderstorm')) {
        createAlert('alert-storm', 'Warning: A storm is approaching. Please exercise caution.');
        alertsAdded = true;
    }

    if (data.weather.some(weather => weather.main === 'Snow')) {
        createAlert('alert-snow', 'High risk of snow showers in the near future.');
        alertsAdded = true;
    }

    if (data.weather.some(weather => weather.main === 'Clear')) {
        if (currentHour < 6 || currentHour > 18) {
            createAlert('alert-sunny', 'The sky is clear tonight, expect calm weather.');
        } else {
            createAlert('alert-sunny', 'Today’s weather is sunny, perfect for a walk!');
        }
        if (data.main.temp > 25) {
            createAlert('alert-suncream', 'Don’t forget to use sunscreen today!');
        }
        alertsAdded = true;
    }

    if (!alertsAdded) {
        createAlert('alert-default', 'No significant weather alerts. The weather is calm!');
    }
};


const createAlert = (className, message) => {
    const alertList = document.getElementById('alerts-list');
    const li = document.createElement('li');
    li.classList.add('alert', className);
    li.textContent = message;
    alertList.appendChild(li);
};


const loadWeatherAlerts = () => {
    const cardAlerts = document.getElementById('card-alerts');
    const isCardAlertsActive = cardAlerts && cardAlerts.classList.contains('active');

    if (isCardAlertsActive) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
                        .then(response => response.json())
                        .then(data => {
                            checkWeatherAlerts(data);
                        })
                        .catch(error => console.error("Error fetching weather alerts:", error));
                },
                (error) => {
                    console.error(`Location error: ${error.message}`);
                    alert('Failed to retrieve location for alerts.');
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            alert('Geolocation is not available in this browser.');
        }
    }
};

loadConfig();