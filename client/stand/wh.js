// wh.js

let selectedCity = '';
let currentIndex = 0;

function getNextPage() {
    const cityInput = document.getElementById('cityInput');
    selectedCity = cityInput.value;

    // Call the function to get weather data and display it on the dashboard
    getWeather();

    // Move to the next page after fetching weather data
    document.getElementById('page1').classList.add('hidden');
    document.getElementById('page2').classList.remove('hidden');
}

function getWeather() {
    // Replace this with your actual API endpoint and logic to fetch weather data
    const apiUrl = `http://127.0.0.1:8000/coordinates/${selectedCity}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Handle the response and update the UI
            displayWeather(data);
            // Set background image based on isday value
            const isDay = data.weather_forecast[2].current.isday === 1;
            setBodyBackground(isDay);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function displayWeather(data) {
    const hourlyForecast = data.weather_forecast[0].hourly;
    const dailyForecast = data.weather_forecast[1].daily;
    const currentWeather = data.weather_forecast[2].current;

    const hourlyWeatherBlock = document.getElementById('hourlyWeather');
    updateWeatherBlock(hourlyWeatherBlock, hourlyForecast);

    const dailyWeatherBlock = document.getElementById('dailyWeather');
    updateWeatherBlock(dailyWeatherBlock, dailyForecast);

    const currentWeatherBlock = document.getElementById('currentWeather');
    updateCurrentWeatherBlock(currentWeatherBlock, currentWeather);
}

function updateWeatherBlock(weatherBlock, weatherData) {
    weatherBlock.innerHTML = '';
    weatherData.forEach(entry => {
        const weatherElement = document.createElement('div');
        weatherElement.classList.add('weather-element', 'm-2', 'p-4', 'bg-white', 'rounded-md', 'shadow-md');

        const time = document.createElement('p');
        time.classList.add('text-sm');
        time.textContent = entry.time;

        const icon = document.createElement('div');
        icon.classList.add('weather-icon', 'bg-gray-200', 'p-2', 'rounded-full');
        // Add logic to set the weather icon based on the weather condition

        const temperature = document.createElement('p');
        temperature.classList.add('text-base');
        temperature.textContent = `Temperature: ${entry.temperature}`;

        const humidity = document.createElement('p');
        humidity.classList.add('text-base');
        humidity.textContent = `humidity: ${entry.humidity}`;

        const windspeed = document.createElement('p');
        windspeed.classList.add('text-base');
        windspeed.textContent = `wind speed: ${entry.wind_speed}`;

        const isday = document.createElement('p');
        isday.classList.add('text-base');
        if (entry.isday == 0) {
            isday.textContent = `Day: Night`;
        } else {
            isday.textContent = `Day: Morning`;
        }

        weatherElement.appendChild(time);
        weatherElement.appendChild(icon);
        weatherElement.appendChild(temperature);
        weatherElement.appendChild(humidity);
        weatherElement.appendChild(isday);
        weatherElement.appendChild(windspeed);
        weatherBlock.appendChild(weatherElement);
    });
}

function updateCurrentWeatherBlock(currentWeatherBlock, currentWeather) {
    currentWeatherBlock.innerHTML = '';

    const time = document.createElement('p');
    time.classList.add('text-base');
    time.textContent = `Time: ${currentWeather.time}`;

    const icon = document.createElement('div');
    icon.classList.add('weather-icon', 'bg-gray-200', 'p-2', 'rounded-full');
    const isDay = currentWeather.isday === 1;
    const weatherIconClass = isDay ? 'sun-icon' : 'moon-icon';
    icon.classList.add(weatherIconClass);

    const windSpeed = document.createElement('p');
    windSpeed.classList.add('text-base');
    windSpeed.textContent = `Wind Speed: ${currentWeather.wind_speed} m/s`;

    const humidity = document.createElement('p');
    humidity.classList.add('text-base');
    humidity.textContent = `Humidity: ${currentWeather.humidity}%`;

    const rain = document.createElement('p');
    rain.classList.add('text-base');
    rain.textContent = `Rain: ${currentWeather.rain} mm`;

    currentWeatherBlock.appendChild(time);
    currentWeatherBlock.appendChild(icon);
    currentWeatherBlock.appendChild(windSpeed);
    currentWeatherBlock.appendChild(humidity);
    currentWeatherBlock.appendChild(rain);
}

function setBodyBackground(isDay) {
    const body = document.body;

    if (isDay) {
        body.style.backgroundColor = "#f0f4c3"; // Day background color
    } else {
        body.style.backgroundColor = "#1a1a1a"; // Night background color
    }
}

function slideHourlyForecast() {
    const hourlyContainer = document.getElementById('hourlyWeather');
    const hourlyElements = document.getElementsByClassName('weather-element');

    if (currentIndex < hourlyElements.length - 1) {
        currentIndex++;
        const newPosition = -currentIndex * (hourlyElements[0].offsetWidth + 10); // 10px margin-right
        hourlyContainer.style.transform = `translateX(${newPosition}px)`;
    }
}

