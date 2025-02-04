import React from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  CloudFog,
} from 'lucide-react';

export const WeatherIcon = ({ iconCode, className }) => {
  const getIcon = () => {
    switch (iconCode) {
      case '01d':
      case '01n':
        return <Sun className={`${className} hover:scale-110 transition duration-300`} />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <Cloud className={`${className} hover:scale-110 transition duration-300`} />;
      case '09d':
      case '09n':
        return <CloudDrizzle className={`${className} hover:scale-110 transition duration-300`} />;
      case '10d':
      case '10n':
        return <CloudRain className={`${className} hover:scale-110 transition duration-300`} />;
      case '11d':
      case '11n':
        return <CloudLightning className={`${className} hover:scale-110 transition duration-300`} />;
      case '13d':
      case '13n':
        return <CloudSnow className={`${className} hover:scale-110 transition duration-300`} />;
      case '50d':
      case '50n':
        return <CloudFog className={`${className} hover:scale-110 transition duration-300`} />;
      default:
        return <Sun className={`${className} hover:scale-110 transition duration-300`} />;
    }
  };

  return getIcon();
};
