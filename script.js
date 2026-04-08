// ======================================
// Smart City Weather Dashboard
// Using OpenWeatherMap API
// ======================================

const API_KEY = "a2e3320d35f4430fa8b182855260104";  // Keep your actual API key for dev
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const DEFAULT_CITIES = [
    "Pune", "Mumbai", "Delhi", "Bangalore", 
    "Chennai", "Kolkata", "Hyderabad", "Ahmedabad"
];

let weatherData = []; // State to hold fetched weather data
let currentFavorites = JSON.parse(localStorage.getItem("weatherFavorites")) || [];

// -------- DOM Elements --------
const weatherGrid = document.getElementById("weatherGrid");
const loadingIndicator = document.getElementById("loadingIndicator");
const statusMessage = document.getElementById("statusMessage");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const filterSelect = document.getElementById("filterSelect");
const themeToggle = document.getElementById("themeToggle");

// -------- Init --------
function init() {
    // Check Dark Mode
    const savedTheme = localStorage.getItem("weatherTheme");
    if (savedTheme === "dark") {
        document.body.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️";
    }

    // Fetch initial data
    fetchAllWeather();
}

// -------- Theme Toggle --------
themeToggle.addEventListener("click", () => {
    const isDark = document.body.getAttribute("data-theme") === "dark";
    if (isDark) {
        document.body.removeAttribute("data-theme");
        themeToggle.textContent = "🌙";
        localStorage.setItem("weatherTheme", "light");
    } else {
        document.body.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️";
        localStorage.setItem("weatherTheme", "dark");
    }
});

// -------- Fetch Initial Data --------
async function fetchAllWeather() {
    showLoading(true);
    
    try {
        // Use map() to create an array of promises
        const promises = DEFAULT_CITIES.map(city => fetchWeatherData(city));
        const results = await Promise.all(promises);
        
        // Filter out any failed requests
        weatherData = results.filter(data => data !== null);
        
        if (weatherData.length === 0) {
            showStatus("Failed to load weather data. Please try later.");
        } else {
            showStatus(""); // clear status
            applyProcessors(); // Render with current filters/sort
        }
    } catch (error) {
        showStatus("An error occurred while fetching data.");
    } finally {
        showLoading(false);
    }
}

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
}

// -------- Status & Loading --------
function showLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.classList.remove("hidden");
        weatherGrid.innerHTML = "";
    } else {
        loadingIndicator.classList.add("hidden");
    }
}

function showStatus(message) {
    statusMessage.textContent = message;
}

// -------- Search, Filter, Sort Processing --------

// Debouncing for Search input
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

const handleSearch = debounce(() => {
    applyProcessors();
}, 500);

searchInput.addEventListener("input", handleSearch);
sortSelect.addEventListener("change", applyProcessors);
filterSelect.addEventListener("change", applyProcessors);

function applyProcessors() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filterValue = filterSelect.value;
    const sortValue = sortSelect.value;

    // 1. SEARCH (using Array.filter)
    let processedData = weatherData.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );

    // 2. FILTER (using Array.filter)
    processedData = processedData.filter(item => {
        if (filterValue === "all") return true;
        if (filterValue === "hot") return item.main.temp > 30;
        if (filterValue === "mild") return item.main.temp >= 20 && item.main.temp <= 30;
        if (filterValue === "cold") return item.main.temp < 20;
        if (filterValue === "favorites") return currentFavorites.includes(item.id);
        return true;
    });

    // 3. SORT (using Array.sort)
    processedData.sort((a, b) => {
        if (sortValue === "nameAsc") {
            return a.name.localeCompare(b.name);
        } else if (sortValue === "nameDesc") {
            return b.name.localeCompare(a.name);
        } else if (sortValue === "tempAsc") {
            return a.main.temp - b.main.temp;
        } else if (sortValue === "tempDesc") {
            return b.main.temp - a.main.temp;
        }
        return 0; // default
    });

    renderCards(processedData);
}

// -------- Render UI --------
function renderCards(dataArray) {
    weatherGrid.innerHTML = "";

    if (dataArray.length === 0) {
        weatherGrid.innerHTML = "<p class='status-message' style='grid-column: 1/-1'>No cities found matching criteria.</p>";
        return;
    }

    // MAP using to convert data array to HTML elements and append
    dataArray.map(data => {
        const isFav = currentFavorites.includes(data.id);
        
        const card = document.createElement("div");
        card.className = "weather-card";
        card.innerHTML = `
            <div class="card-header">
                <h2>${data.name}, ${data.sys.country}</h2>
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${data.id})" aria-label="Toggle Favorite">
                    ❤️
                </button>
            </div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
            <p class="temperature">${Math.round(data.main.temp)} °C</p>
            <p class="description">${data.weather[0].description}</p>
            <div class="details">
                <div class="detail-item">
                    <span>🌬 Wind</span>
                    <p>${data.wind.speed} m/s</p>
                </div>
                <div class="detail-item">
                    <span>💧 Humidity</span>
                    <p>${data.main.humidity}%</p>
                </div>
            </div>
        `;
        weatherGrid.appendChild(card);
    });
}

// -------- Button Interaction (Favorites) --------
window.toggleFavorite = function(cityId) {
    if (currentFavorites.includes(cityId)) {
        // Remove from favorites using Array HOF filter
        currentFavorites = currentFavorites.filter(id => id !== cityId);
    } else {
        // Add to favorites
        currentFavorites.push(cityId);
    }
    
    // Save to Local Storage
    localStorage.setItem("weatherFavorites", JSON.stringify(currentFavorites));
    
    // Re-render
    applyProcessors();
};

// Start app
init();
