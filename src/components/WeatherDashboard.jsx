import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeatherData } from '../lib/api'; // Make sure this function can handle city names
import { WeatherIcon } from './WeatherIcon';
import { useWeatherStore } from '../store/weatherStore';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const WeatherDashboard = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [location, setLocation] = useState(''); // State to store the searched location
  const [cityName, setCityName] = useState(''); // New state to store the city name
  const { unit, toggleUnit } = useWeatherStore();
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Function to handle search submit
  const handleSearch = () => {
    if (location) {
      fetchCoordinatesForLocation(location);
    }
  };

  // Fetching coordinates based on city name
  const fetchCoordinatesForLocation = async (city) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
      const data = await response.json();
      setCoordinates({ lat: data.coord.lat, lon: data.coord.lon });
      setCityName(data.name); // Set the city name
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      alert('Unable to find location. Please try again.');
    }
  };

  useEffect(() => {
    if ('geolocation' in navigator && !coordinates) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setCoordinates({ lat: 7.087310, lon: 80.014366 }); // Default to London if geolocation fails
        }
      );
    }
  }, [coordinates]);

  const { data: weather, isLoading, error } = useQuery({
    queryKey: ['weather', coordinates],
    queryFn: () => coordinates ? getWeatherData(coordinates) : null,
    enabled: !!coordinates,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 font-semibold">Error loading weather data</p>
      </div>
    );
  }

  if (!weather) return null;

  const convertTemp = (temp) => {
    return unit === 'fahrenheit' ? (temp * 9 / 5) + 32 : temp;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4x3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-6 sm:p-8 text-white mb-10 mt-10">
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-white mb-4 sm:mb-0">
            Weather X
          </h1>

          {/* Search Bar */}
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search for a location..."
              className="px-4 py-2 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none w-full sm:w-auto"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition duration-300"
            >
              Search
            </button>
          </div>

          <button
            onClick={toggleUnit}
            className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition duration-300"
          >
            {unit === 'celsius' ? '°C' : '°F'}
          </button>
        </div>

        {/* City Name */}
        <div className="text-center mb-6">
          <h3 className="text-2xl sm:text-3xl font-semibold">{cityName || 'Your Location'}</h3>
        </div>

        {/* Current Weather */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div className="flex items-center space-x-4">
            <WeatherIcon
              iconCode={weather.current.weather[0].icon}
              className="w-28 sm:w-32 h-28 sm:h-32 text-yellow-500"
            />
            <div>
              <h2 className="text-4xl sm:text-6xl font-semibold">
                {Math.round(convertTemp(weather.current.temp))}° {unit === 'celsius' ? 'C' : 'F'}
              </h2>
              <p className="text-lg sm:text-xl capitalize">{weather.current.weather[0].description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 backdrop-blur-lg p-4 rounded-lg">
              <p className="text-sm">Humidity</p>
              <p className="text-xl font-bold">{weather.current.humidity}%</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 backdrop-blur-lg p-4 rounded-lg">
              <p className="text-sm">Wind Speed</p>
              <p className="text-xl font-bold">{Math.round(weather.current.wind_speed)} m/s</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 backdrop-blur-lg p-4 rounded-lg">
              <p className="text-sm">UV Index</p>
              <p className="text-xl font-bold">{Math.round(weather.current.uvi)}</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 backdrop-blur-lg p-4 rounded-lg">
              <p className="text-sm">Pressure</p>
              <p className="text-xl font-bold">{weather.current.pressure} hPa</p>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {weather.daily.slice(0, 5).map((day) => (
              <div key={day.dt} className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-lg text-center shadow-lg hover:shadow-2xl transition duration-300">
                <p className="text-sm">{format(day.dt * 1000, 'EEE')}</p>
                <WeatherIcon
                  iconCode={day.weather[0].icon}
                  className="w-12 h-12 mx-auto my-2"
                />
                <p className="text-lg font-semibold">
                  {Math.round(convertTemp(day.temp.max))}° / {Math.round(convertTemp(day.temp.min))}°
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Forecast */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">24-Hour Forecast</h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 py-2">
              {weather.hourly.slice(0, 24).map((hour) => (
                <div key={hour.dt} className="flex-shrink-0 text-center w-20">
                  <p className="text-xs">{format(hour.dt * 1000, 'HH:mm')}</p>
                  <WeatherIcon
                    iconCode={hour.weather[0].icon}
                    className="w-8 h-8 mx-auto my-2"
                  />
                  <p className="text-lg font-semibold">
                    {Math.round(convertTemp(hour.temp))}°
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
