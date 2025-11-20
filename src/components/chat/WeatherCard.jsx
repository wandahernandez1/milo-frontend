import React from "react";
import "../../styles/WeatherCard.css";

export default function WeatherCard({ weatherData }) {
  if (!weatherData) return null;

  const {
    location,
    temperature,
    feelsLike,
    description,
    humidity,
    windSpeed,
    icon,
  } = weatherData;

  const getWeatherEmoji = (iconCode) => {
    const iconMap = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅",
      "02n": "☁️",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };
    return iconMap[iconCode] || "🌤️";
  };

  return (
    <div className="weather-card-widget">
      <div className="weather-header">
        <div className="weather-location">
          <span className="location-icon">📍</span>
          <span className="location-name">{location}</span>
        </div>
      </div>

      <div className="weather-main">
        <div className="weather-icon-large">{getWeatherEmoji(icon)}</div>
        <div className="weather-temp-section">
          <div className="weather-temperature">{temperature}°C</div>
          <div className="weather-description">{description}</div>
          <div className="weather-feels-like">
            Sensación térmica: {feelsLike}°C
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="weather-detail-item">
          <span className="detail-icon">💧</span>
          <div className="detail-content">
            <span className="detail-label">Humedad</span>
            <span className="detail-value">{humidity}%</span>
          </div>
        </div>
        <div className="weather-detail-item">
          <span className="detail-icon">💨</span>
          <div className="detail-content">
            <span className="detail-label">Viento</span>
            <span className="detail-value">{windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
