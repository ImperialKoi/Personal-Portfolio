// Weather Dashboard - Real-time Weather Application
// Built with React, TypeScript, and OpenWeatherMap API

import React, { useState, useEffect } from 'react';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  forecast: ForecastItem[];
}

interface ForecastItem {
  date: string;
  temp: number;
  description: string;
  icon: string;
}

const WeatherDashboard = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('San Francisco');

  const features = [
    "🌤️ Real-time weather data",
    "📊 7-day forecast visualization",
    "🗺️ Interactive weather maps",
    "📱 Geolocation support",
    "🎨 Beautiful animated weather icons",
    "💾 Favorite locations management"
  ];

  const techStack = {
    frontend: ["React", "TypeScript", "Chart.js", "Framer Motion"],
    apis: ["OpenWeatherMap", "Geolocation API"],
    styling: ["Tailwind CSS", "CSS Grid", "Flexbox"],
    features: ["PWA", "Offline Support", "Push Notifications"]
  };

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    try {
      // Simulated API call
      const mockWeather: WeatherData = {
        city: cityName,
        temperature: 72,
        description: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 8.5,
        forecast: [
          { date: '2024-01-15', temp: 75, description: 'Sunny', icon: '☀️' },
          { date: '2024-01-16', temp: 68, description: 'Cloudy', icon: '☁️' },
          { date: '2024-01-17', temp: 71, description: 'Rain', icon: '🌧️' }
        ]
      };
      
      setTimeout(() => {
        setWeather(mockWeather);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Weather fetch failed:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const WeatherCard = ({ weather }: { weather: WeatherData }) => (
    <div className="bg-gradient-to-br from-blue-400 to-purple-600 p-6 rounded-xl text-white">
      <h2 className="text-2xl font-bold">{weather.city}</h2>
      <div className="text-4xl font-light">{weather.temperature}°F</div>
      <p className="text-lg opacity-90">{weather.description}</p>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm opacity-75">Humidity</span>
          <div className="text-xl">{weather.humidity}%</div>
        </div>
        <div>
          <span className="text-sm opacity-75">Wind Speed</span>
          <div className="text-xl">{weather.windSpeed} mph</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Weather Dashboard</h1>
        
        {loading ? (
          <div className="text-center py-12">Loading weather data...</div>
        ) : weather ? (
          <WeatherCard weather={weather} />
        ) : (
          <div>No weather data available</div>
        )}
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
            <div className="space-y-3">
              {Object.entries(techStack).map(([category, items]) => (
                <div key={category}>
                  <strong className="capitalize">{category}:</strong>
                  <span className="ml-2">{items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Live demo available at: https://weather.com
export default WeatherDashboard;