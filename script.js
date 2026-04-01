// ======================================
// Smart City Weather Dashboard
// Using OpenWeatherMap API
// ======================================

const API_KEY = "a2e3320d35f4430fa8b182855260104";  // <-- Put your actual API key here
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// -------- DOM Elements --------
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const weatherContainer = document.getElementById("weatherContainer");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");

// -------- Event Listener --------
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    fetchWeather(city);
});

// -------- Fetch Weather --------
async function fetchWeather(city) {

    showLoading(true);
    clearError();

    try {
        const response = await fetch(
            `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        // 🔥 Better error handling
        if (response.status === 401) {
            throw new Error("Invalid API Key. Please check your API key.");
        }

        if (response.status === 404) {
            throw new Error("City not found. Please try again.");
        }

        if (!response.ok) {
            throw new Error("Something went wrong. Please try later.");
        }

        updateUI(data);

    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// -------- Update UI --------
function updateUI(data) {

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${data.main.temp} °C`;
    weatherDescription.textContent = data.weather[0].description;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    humidity.textContent = `${data.main.humidity} %`;

    weatherContainer.classList.remove("hidden");
}

// -------- Loading --------
function showLoading(isLoading) {
    if (isLoading) {
        loadingDiv.classList.remove("hidden");
        weatherContainer.classList.add("hidden");
    } else {
        loadingDiv.classList.add("hidden");
    }
}

// -------- Error --------
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}

function clearError() {
    errorDiv.classList.add("hidden");
    errorDiv.textContent = "";
}
