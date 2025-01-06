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
    if (document.getElementById("card-search").classList.contains("active")) {
        searchCity.querySelector("figcaption").innerText = data.name;
        searchCity.querySelector("img").src = "https://flagsapi.com/" + data.sys.country + "/shiny/32.png";

        searchTemperature.querySelector("img").src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@4x.png";
        searchTemperature.querySelector("figcaption span").innerText = Math.round(data.main.temp) + "°C";
        searchDescription.innerText = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
        searchClouds.innerText = data.clouds.all;
        searchHumidity.innerText = data.main.humidity;
        searchPressure.innerText = data.main.pressure;
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
        console.error('Błąd podczas ładowania pliku konfiguracyjnego:', error);
    }
};

const getUrl = () => `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}`;


const searchWeather = () => {
    const searchQuery = valueSearch.value.trim();

    if (searchQuery !== "") {
        fetch(`${getUrl()}&q=${searchQuery}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.cod === 200) {
                    updateWeatherUI(data);
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
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                fetch(`${getUrl()}&lat=${latitude}&lon=${longitude}`)
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
    valueSearch.value = "";
};

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (valueSearch.value !== "") {
        searchWeather();
    }
});

loadConfig();