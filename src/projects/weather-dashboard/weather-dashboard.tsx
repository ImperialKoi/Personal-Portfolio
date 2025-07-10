// Weather Dashboard Application
// React TypeScript weather app with forecasting

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: ForecastDay[];
}

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
}

const WeatherDashboard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('New York');
  const [loading, setLoading] = useState(false);

  // Mock weather data
  const mockWeatherData: WeatherData = {
    location: 'New York, NY',
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: 'Today', high: 75, low: 68, condition: 'Partly Cloudy' },
      { day: 'Tomorrow', high: 78, low: 70, condition: 'Sunny' },
      { day: 'Wednesday', high: 73, low: 65, condition: 'Rainy' },
      { day: 'Thursday', high: 69, low: 62, condition: 'Cloudy' },
      { day: 'Friday', high: 76, low: 68, condition: 'Sunny' }
    ]
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWeather(mockWeatherData);
      setLoading(false);
    }, 1000);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  const handleLocationChange = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Weather Dashboard</h1>
          <form onSubmit={handleLocationChange} className="flex justify-center">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 rounded-l-lg border-none outline-none"
              placeholder="Enter location..."
            />
            <button
              type="submit"
              className="px-6 py-2 bg-white text-blue-600 rounded-r-lg hover:bg-gray-100 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {weather && (
          <>
            {/* Current Weather */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{weather.location}</h2>
                  <p className="text-lg opacity-90">{weather.condition}</p>
                </div>
                {getWeatherIcon(weather.condition)}
              </div>
              
              <div className="text-6xl font-light mb-4">{weather.temperature}°F</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Droplets className="w-5 h-5 mr-2" />
                  <span>Humidity: {weather.humidity}%</span>
                </div>
                <div className="flex items-center">
                  <Wind className="w-5 h-5 mr-2" />
                  <span>Wind: {weather.windSpeed} mph</span>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="font-semibold mb-2">{day.day}</div>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="text-sm opacity-90 mb-1">{day.condition}</div>
                    <div className="flex justify-between">
                      <span className="font-semibold">{day.high}°</span>
                      <span className="opacity-70">{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;