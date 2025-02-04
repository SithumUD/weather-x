import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});

export const getWeatherData = async ({ lat, lon }) => {
  const { data } = await api.get('/onecall', {
    params: {
      lat,
      lon,
      exclude: 'minutely,alerts',
    },
  });
  return data;
};

export const searchLocations = async (query) => {
  const { data } = await api.get('/geo/1.0/direct', {
    params: {
      q: query,
      limit: 5,
    },
  });
  return data;
};
