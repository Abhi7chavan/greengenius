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
            const preloader = document.querySelector(".data-loader");

            // Function to show the preloader
            function showPreloader() {
                preloader.style.display = "flex";
            }
        
            // Function to hide the preloader
            function hidePreloader() {
                preloader.style.display = "none";
            }
            // Handle the response and update the UI
            showPreloader();
            displayWeather(data);
            hidePreloader();
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
    const aqiWeather = data.weather_forecast[3].air;
    const isDay = data.weather_forecast[2].current.isday === 1;
    setBodyBackground(isDay);

    const hourlyWeatherBlock = document.getElementById('hourlyWeather');
    updateWeatherBlock_hourly(hourlyWeatherBlock, hourlyForecast);

    const dailyWeatherBlock = document.getElementById('dailyWeather');
    updateWeatherBlock_daily(dailyWeatherBlock, dailyForecast,aqiWeather);

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

        const dewpoint = document.createElement('p');
        dewpoint.classList.add('text-base');
        dewpoint.textContent = `dew point: ${entry.dew_point}`;

        const windspeed = document.createElement('p');
        windspeed.classList.add('text-base');
        windspeed.textContent = `wind speed: ${entry.wind_speed}`;

        weatherElement.appendChild(time);
        weatherElement.appendChild(icon);
        weatherElement.appendChild(temperature);
        weatherElement.appendChild(humidity);
        weatherElement.appendChild(windspeed);
        weatherElement.appendChild(dewpoint);
        weatherBlock.appendChild(weatherElement);
    });
}

function updateWeatherBlock_daily(dailyWeatherBlock, dailyForecast,aqiWeather){
    dailyWeatherBlock.innerHTML = '';
    const sunrise = document.createElement('p')
    sunrise.classList.add('text-base');
    sunrise.textContent = `sunrise ${dailyForecast.sunrise}`;

    const sunrise_icon = document.createElement('img');
    sunrise_icon.classList.add('weather-icon', 'rounded-full');
    sunrise_icon.style.width = '60px'; // Adjust the width as needed
    sunrise_icon.style.height = '60px'; // Adjust the height as needed
    sunrise_icon.style.display = 'block';
    sunrise_icon.style.margin = 'auto';
    const sunriseiconImagePath ='sunrise.gif';
    sunrise_icon.setAttribute('src', sunriseiconImagePath);


    const sunset_icon = document.createElement('img');
    sunset_icon.classList.add('weather-icon', 'rounded-full');
    sunset_icon.style.width = '40px'; // Adjust the width as needed
    sunset_icon.style.height = '40px'; // Adjust the height as needed
    sunset_icon.style.display = 'block';
    sunset_icon.style.margin = 'auto';
    const sunseticonImagePath ='sunset.gif';
    sunset_icon.setAttribute('src', sunseticonImagePath);

    const sunset = document.createElement('p');
    sunset.classList.add('text-base');
    sunset.textContent = `sunset ${dailyForecast.sunset}`;


    const co2 = document.createElement('p')
    co2.classList.add('text-base');
    co2.textContent = `Co2:${aqiWeather.carbon_monoxide}`;

    const no2 = document.createElement('p')
    no2.classList.add('text-base');
    no2.textContent = `No2:${aqiWeather.nitrogen_dioxide}`;

    const so2 = document.createElement('p')
    so2.classList.add('text-base');
    so2.textContent = `So2:${aqiWeather.sulphur_dioxide}`;

    const ozone = document.createElement('p')
    ozone.classList.add('text-base');
    ozone.textContent = `ozone:${aqiWeather.ozone}`;

    const dust = document.createElement('p')
    dust.classList.add('text-base');
    dust.textContent = `dust:${aqiWeather.dust}`;
    
    const airicon = document.createElement('img');
    airicon.classList.add('weather-icon', 'rounded-full');
    airicon.style.width = '60px'; // Adjust the width as needed
    airicon.style.height = '60px'; // Adjust the height as needed
    airicon.style.display = 'block';
    airicon.style.margin = 'auto';
    const airiconImagePath ='truck.gif';
    airicon.setAttribute('src', airiconImagePath);

    //check air index by Who guidelines

    const airQualityData = {
        carbon_monoxide:aqiWeather.carbon_monoxide ,
        nitrogen_dioxide: aqiWeather.nitrogen_dioxide,
        sulphur_dioxide: aqiWeather.sulphur_dioxide,
        ozone: aqiWeather.ozone,
        dust: aqiWeather.dust
    };

    function assessAirQuality(data) {
        const results = {};
    
        // WHO guideline values
        const guidelines = {
            carbon_monoxide: 10,  // µg/m³
            nitrogen_dioxide: 200,  // µg/m³
            sulphur_dioxide: 20,  // µg/m³
            ozone: 100,  // µg/m³
            dust: 50  // µg/m³
        };
    
        // Assess each pollutant
        for (const pollutant in guidelines) {
            if (data[pollutant] <= guidelines[pollutant]) {
                results[pollutant] = 'Good';
            } else {
                results[pollutant] = 'Poor';
            }
        }
    
        return results;
    }


    const airQualityAssessment = assessAirQuality(airQualityData);

    function assessOverallAirQuality(data) {
        const poorPollutants = Object.values(data).filter(result => result === 'Poor');
    
        if (poorPollutants.length >= 3) {
            return true;  // Return true for bad air quality
        } else {
            return false;  // Return false for good air quality
        }
    }

    const overallAirQuality = assessOverallAirQuality(airQualityAssessment);

    const checkair = document.createElement('img');
    checkair.classList.add('weather-icon', 'rounded-full');
    checkair.style.width = '60px'; // Adjust the width as needed
    checkair.style.height = '60px'; // Adjust the height as needed
    checkair.style.display = 'block';
    checkair.style.margin = 'auto';
    debugger
    const airindexImagePath = overallAirQuality ? 'air-quality-bad.png' : 'air-quality-good.png';
    checkair.setAttribute('src', airindexImagePath);


    const airQualityMessages = {
        false: 'The air quality is good. Enjoy the fresh air!',
        true: 'The air quality is bad. Consider taking precautions.'
    };

    const airQualityMessage = airQualityMessages[overallAirQuality];

    const message = document.createElement('p')
    message.classList.add('text-base');
    message.textContent = `${airQualityMessage}`;

    



    

    dailyWeatherBlock.appendChild(sunrise_icon);
    dailyWeatherBlock.appendChild(sunrise);
    dailyWeatherBlock.appendChild(sunset_icon);
    dailyWeatherBlock.appendChild(sunset);
    dailyWeatherBlock.appendChild(airicon);
    // dailyWeatherBlock.appendChild(co2);
    // dailyWeatherBlock.appendChild(no2);
    // dailyWeatherBlock.appendChild(so2);
    // dailyWeatherBlock.appendChild(ozone);
    // dailyWeatherBlock.appendChild(dust);
    dailyWeatherBlock.appendChild(message);
    dailyWeatherBlock.appendChild(checkair);
}

function updateCurrentWeatherBlock_currently(currentWeatherBlock, currentWeather) {
    currentWeatherBlock.innerHTML = '';

    // Create a container to hold temperature, time, and image
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('flex', 'items-center', 'gap-4', 'mb-4');

    const temperature = document.createElement('p');
    temperature.classList.add('text-base');
    temperature.textContent = `${currentWeather.temperature}`;

    const time = document.createElement('p');
    time.classList.add('text-base');
    time.textContent = `${currentWeather.time}`;

    // set cityname 
    const cityname = document.createElement('h1');
    cityname.classList.add('text-2xl', 'font-bold'); // Adjust the size and boldness as needed
    cityname_input = localStorage.getItem('city');
    cityname.textContent = `${cityname_input}`.toUpperCase(); 
    
    // Append the element to the document or your desired container
    // Set common styles for the image
    
    const icon = document.createElement('img');
    icon.classList.add('weather-icon', 'rounded-full');
    icon.style.width = '35px'; // Adjust the width as needed
    icon.style.height = '35px'; // Adjust the height as needed
    icon.style.display = 'block';
    icon.style.margin = 'auto';
    // Determine whether it's day or night based on the isday property from the weather data
    const isDay = currentDaytime(currentWeather.time);
    function currentDaytime(timeString) {
        const hour = parseInt(timeString.split(' ')[1].split(':')[0], 10); // Extract the hour part
        return hour >= 6 && hour < 18;
    }
    
    // Use a conditional (ternary) operator to set the src attribute for the image
    const iconImagePath = isDay ? 'sun.png' : 'moon.png';
    icon.setAttribute('src', iconImagePath);
    // Set alt attribute for accessibility
    icon.setAttribute('alt', isDay ? 'Sun Icon' : 'Moon Icon');

    const windicon = document.createElement('img');
    windicon.classList.add('weather-icon', 'rounded-full');
    windicon.style.width = '60px'; // Adjust the width as needed
    windicon.style.height = '60px'; // Adjust the height as needed
    windicon.style.display = 'block';
    windicon.style.margin = 'auto';
    const windImagePath = 'turbine.gif';
    windicon.setAttribute('src', windImagePath);



    const windSpeed = document.createElement('p');
    windSpeed.classList.add('text-base');
    windSpeed.textContent = `Wind Speed: ${currentWeather.wind_speed} m/s`;

    const humidity = document.createElement('p');
    humidity.classList.add('text-base');
    humidity.textContent = `Humidity: ${currentWeather.humidity}%`;
    const rain = document.createElement('p');
    rain.classList.add('text-base');
   
    if (currentWeather.rain > 0) {
        const rainImagePath = 'rain.png';
        icon.setAttribute('src', rainImagePath);
    }

    currentWeatherBlock.appendChild(cityname);
    currentWeatherBlock.appendChild(infoContainer);
    currentWeatherBlock.appendChild(time);
    currentWeatherBlock.appendChild(temperature);
    currentWeatherBlock.appendChild(icon);
    currentWeatherBlock.appendChild(humidity);
    currentWeatherBlock.appendChild(rain);
    currentWeatherBlock.appendChild(windicon);
    currentWeatherBlock.appendChild(windSpeed);
}

function setBodyBackground(isDay) {
    const body = document.body;

    if (isDay) {
        body.style.backgroundImage = "url('morning.jpg')"; // Day background image
    } else {
        body.style.backgroundImage = "url('night.jpeg')"; // Night background image
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
    location.reload();
}

