// wh.js

let selectedCity = '';
let currentIndex = 0;
let isFirstVisit = true; 
function getNextPage() {
    const cityInput = document.getElementById('cityInput');
    selectedCity = cityInput.value;
    localStorage.setItem("city",selectedCity);

    // Call the function to get weather data and display it on the dashboard
    getWeather();
    isFirstVisit = true;
    // Move to the next page after fetching weather data
    document.getElementById('page1').classList.add('hidden');
    document.getElementById('page2').classList.remove('hidden');

}

function editLocation() {
    // Show the city input and "Next" button
    document.getElementById('page1').classList.remove('hidden');
    document.getElementById('page2').classList.add('hidden');
    resetWeatherDashboard(); // Optional: Reset the weather dashboard content
}
function getWeather() {
    // Check if it's the first visit or the user is explicitly clicking "Next"
    if (isFirstVisit) {
        isFirstVisit = false;
    } else {
        // If not the first visit, return to avoid unnecessary API calls
        return;
    }

    // Replace this with your actual API endpoint and logic to fetch weather data
    const apiUrl = `http://127.0.0.1:8000/coordinates/${selectedCity}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Handle the response and update the UI
            displayWeather(data);
            // Set background image based on isday value
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function displayWeather(data) {
    const hourlyForecast = data.weather_forecast[0].hourly;
    const dailyForecast = data.weather_forecast[1].daily;
    const currentWeather = data.weather_forecast[2].current;
    const isDay = data.weather_forecast[2].current.isday === 1;
    setBodyBackground(isDay);

    const hourlyWeatherBlock = document.getElementById('hourlyWeather');
    updateWeatherBlock_hourly(hourlyWeatherBlock, hourlyForecast);

    const dailyWeatherBlock = document.getElementById('dailyWeather');
    updateWeatherBlock_daily(dailyWeatherBlock, dailyForecast);

    const currentWeatherBlock = document.getElementById('currentWeather');
    updateCurrentWeatherBlock_currently(currentWeatherBlock, currentWeather);

    
}

function updateWeatherBlock_hourly(weatherBlock, weatherData) {
    weatherBlock.innerHTML = '';
    weatherData.forEach(entry => {
        const weatherElement = document.createElement('div');
        weatherElement.classList.add('weather-element', 'm-2', 'p-4', 'bg-white', 'rounded-md', 'shadow-md');

        const time = document.createElement('p');
        time.classList.add('text-sm');
        time.textContent = entry.time;

        const icon = document.createElement('img');
        icon.classList.add('weather-icon', 'rounded-full');
        icon.style.width = '40px'; // Adjust the width as needed
        icon.style.height = '40px'; // Adjust the height as needed
        icon.style.display = 'block';
        icon.style.margin = 'auto';

        const timeString = entry.time; 
        const is_Day = isDaytime(timeString);
        
        function isDaytime(timeString) {
            const hour = parseInt(timeString.split(' ')[1], 10); // Extract the hour part
            return hour >= 6 && hour < 18;
        }
        
  
        const iconImagePath = is_Day ? 'sun.png' : 'moon.png';
        icon.setAttribute('src', iconImagePath);
        
        // Set alt attribute for accessibility
        icon.setAttribute('alt', is_Day ? 'Sun Icon' : 'Moon Icon');


        const temperature = document.createElement('p');
        temperature.classList.add('text-base');
        temperature.textContent = `Temperature: ${entry.temperature}`;

        const humidity = document.createElement('p');
        humidity.classList.add('text-base');
        humidity.textContent = `humidity: ${entry.humidity}`;

        const windspeed = document.createElement('p');
        windspeed.classList.add('text-base');
        windspeed.textContent = `wind speed: ${entry.wind_speed}`;

        weatherElement.appendChild(time);
        weatherElement.appendChild(icon);
        weatherElement.appendChild(temperature);
        weatherElement.appendChild(humidity);
        weatherElement.appendChild(windspeed);
        weatherBlock.appendChild(weatherElement);
    });
}

function updateWeatherBlock_daily(dailyWeatherBlock, dailyForecast){
    dailyWeatherBlock.innerHTML = '';
    const sunrise = document.createElement('p')
    sunrise.classList.add('text-base');
    sunrise.textContent = `sunrise:${dailyForecast.sunrise}`;

    const sunrise_icon = document.createElement('img');
    sunrise_icon.classList.add('weather-icon', 'rounded-full');
    sunrise_icon.style.width = '40px'; // Adjust the width as needed
    sunrise_icon.style.height = '40px'; // Adjust the height as needed
    sunrise_icon.style.display = 'block';
    sunrise_icon.style.margin = 'auto';
    const sunriseiconImagePath ='sunrise.png';
    sunrise_icon.setAttribute('src', sunriseiconImagePath);


    const sunset_icon = document.createElement('img');
    sunset_icon.classList.add('weather-icon', 'rounded-full');
    sunset_icon.style.width = '40px'; // Adjust the width as needed
    sunset_icon.style.height = '40px'; // Adjust the height as needed
    sunset_icon.style.display = 'block';
    sunset_icon.style.margin = 'auto';
    const sunseticonImagePath ='sunset.png';
    sunset_icon.setAttribute('src', sunseticonImagePath);

    const sunset = document.createElement('p');
    sunset.classList.add('text-base');
    sunset.textContent = `sunset:${dailyForecast.sunset}`;
    dailyWeatherBlock.appendChild(sunrise_icon);
    dailyWeatherBlock.appendChild(sunrise);
    dailyWeatherBlock.appendChild(sunset_icon);
    dailyWeatherBlock.appendChild(sunset);
}

function updateCurrentWeatherBlock_currently(currentWeatherBlock, currentWeather) {
    currentWeatherBlock.innerHTML = '';
    

    const time = document.createElement('p');
    time.classList.add('text-base');
    time.textContent = `Time: ${currentWeather.time}`;

    // set cityname 
    const cityname = document.createElement('h1');
    cityname.classList.add('text-2xl', 'font-bold'); // Adjust the size and boldness as needed
    cityname_input = localStorage.getItem('city');
    cityname.textContent = `${cityname_input}`.toUpperCase(); 
    
    // Append the element to the document or your desired container
    // Set common styles for the image
    
    const icon = document.createElement('img');
    icon.classList.add('weather-icon', 'rounded-full');
    icon.style.width = '40px'; // Adjust the width as needed
    icon.style.height = '40px'; // Adjust the height as needed
    icon.style.display = 'block';
    icon.style.margin = 'auto';
    // Determine whether it's day or night based on the isday property from the weather data
    const isDay = currentWeather.isday === 1;
    
    // Use a conditional (ternary) operator to set the src attribute for the image
    const iconImagePath = isDay ? 'sun.png' : 'moon.png';
    icon.setAttribute('src', iconImagePath);
    
    // Set alt attribute for accessibility
    icon.setAttribute('alt', isDay ? 'Sun Icon' : 'Moon Icon');


    const windSpeed = document.createElement('p');
    windSpeed.classList.add('text-base');
    windSpeed.textContent = `Wind Speed: ${currentWeather.wind_speed} m/s`;

    const humidity = document.createElement('p');
    humidity.classList.add('text-base');
    humidity.textContent = `Humidity: ${currentWeather.humidity}%`;

    const rain = document.createElement('p');
    rain.classList.add('text-base');
    rain.textContent = `Rain: ${currentWeather.rain} mm`;


    
    currentWeatherBlock.appendChild(cityname);
    currentWeatherBlock.appendChild(time);
    currentWeatherBlock.appendChild(icon);
    currentWeatherBlock.appendChild(windSpeed);
    currentWeatherBlock.appendChild(humidity);
    currentWeatherBlock.appendChild(rain);
}

function setBodyBackground(isDay) {
    const body = document.body;

    if (isDay) {
        body.style.backgroundImage = "url('morning.jpg')"; // Day background image
    } else {
        body.style.backgroundImage = "url('night.jpg')"; // Night background image
    }

    // Adjust background properties for better visibility of content
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
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

function editLocation() {
    // Show the city input and "Next" button
    document.getElementById('page1').classList.remove('hidden');
    document.getElementById('page2').classList.add('hidden');
    resetWeatherDashboard(); // Optional: Reset the weather dashboard content
}

function resetWeatherDashboard() {
    // Optional: Clear the existing weather data if needed
    document.getElementById('selectedCity').textContent = '';
    document.getElementById('dailyWeather').innerHTML = '';
    document.getElementById('currentWeather').innerHTML = '';
    document.getElementById('hourlyWeather').innerHTML = '';
    currentIndex = 0;
}
