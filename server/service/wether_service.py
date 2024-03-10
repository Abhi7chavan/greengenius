from fastapi import APIRouter, FastAPI, HTTPException
import requests
from datetime import datetime
import openmeteo_requests
import pandas as pd

router = APIRouter()






@router.get("/coordinates/{city}")
async def get_city_coordinates(city: str):
    latitude, longitude = get_coordinates(city)
    if latitude is None or longitude is None:
        raise HTTPException(status_code=404, detail="Coordinates not found for the provided city")
    else:
        weather_data = get_weather_forecast(latitude, longitude)
        if weather_data is None:
            raise HTTPException(status_code=404, detail="Failed to fetch weather data")

        hourly_forecast = weather_data["hourly"]['time']
        #daily_sunrise and sunset
        sunrise = format_time(weather_data['daily']['sunrise'])
        sunset =format_time(weather_data['daily']['sunset'])
        daily_time = weather_data['daily']['time']
        result = []
        hourly_lst = []

        for data in range(len(hourly_forecast)):
            #hourly
            time = weather_data['hourly']['time'][data]
            temp = weather_data['hourly']['temperature_2m'][data]
            rain = weather_data['hourly']['rain'][data]
            humidity = weather_data['hourly']['relative_humidity_2m'][data]
            wind_speed = weather_data['hourly']['wind_speed_10m'][data]
            wind_direction = weather_data['hourly']['wind_direction_10m'][data]
            dew_point = weather_data['hourly']['dew_point_2m'][data]
            precipitation = weather_data['hourly']['precipitation'][data]
            showers = weather_data['hourly']['showers'][data]
            snowfall = weather_data['hourly']['snowfall'][data]
            weather_code = weather_data['hourly']['weather_code'][data]
            cloud_cover = weather_data['hourly']['cloud_cover'][data]
            
            
            timeformat = format_time(time)
            weather_info = {
                    "date": timeformat[0],
                    "time": f"{timeformat[0]} {timeformat[1]}",
                    "temperature": f"{temp}°C",
                    "humidity": f"{humidity}%",
                    "rain": f"{rain}mm",
                    "wind_speed": f"{wind_speed} m/s",
                    "wind_direction": f"{wind_direction}°",
                    "dew_point": f"{dew_point}°C",
                    "precipitation": f"{precipitation}mm",
                    "showers": f"{showers}mm",
                    "snowfall": f"{snowfall}mm",
                    "weather_code": weather_code,
                    "cloud_cover": f"{cloud_cover}%",
                }
            hourly_lst.append(weather_info)
        result.append({"hourly":hourly_lst})    
        #current
        current_time = weather_data['current']['time']
        tempature_current = weather_data['current']['temperature_2m']
        isday = weather_data['current']['is_day']
        humidity = weather_data['current']['relative_humidity_2m']
        rain = weather_data['current']['rain']

        currenttime = format_time(current_time)
        
        result.append({"daily":{"sunrise":f"{sunrise[1]} AM",
                "sunset":f"{sunset[1]} PM","time":daily_time}})
        result.append({"current":{"time":f"{currenttime[0]},{currenttime[1]}","isday":isday,"wind_speed":wind_speed,"humidity":humidity,"rain":rain,"temperature":tempature_current}})
        return {"statuscode":200,"weather_forecast": result}
    
    
def get_coordinates(city):
    base_url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": city,
        "format": "json",
    }

    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data:
            latitude = float(data[0]['lat'])
            longitude = float(data[0]['lon'])
            return latitude, longitude
    return None, None

def get_weather_forecast(latitude, longitude):
    # api_url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,surface_pressure,wind_speed_10m,soil_temperature_0cm&daily=sunrise,sunset&timezone=auto,is_day"
    api_url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "rain", "showers", "snowfall", "surface_pressure"],
        "hourly": ["temperature_2m", "rain","relative_humidity_2m","wind_speed_10m","wind_direction_10m","dew_point_2m", "precipitation", "showers", "snowfall", "weather_code", "cloud_cover"],
        "daily": ["sunrise", "sunset"],
        "timezone": "auto",
        "forecast_days": 1}

    response = requests.get(api_url,params=params)
        
    if response.status_code == 200:
        weather_data = response.json()
        return weather_data
    else:
        return None

def format_time(time):
    if type(time) != list:
        time_obj = datetime.strptime(time, "%Y-%m-%dT%H:%M")
    else:
        time_obj = datetime.strptime(time[0], "%Y-%m-%dT%H:%M")

    # Format time in 24-hour format
    time_24h = time_obj.strftime("%Y-%m-%d %H:%M")
    timeformat = time_24h.split()
    return timeformat
    
