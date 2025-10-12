import { useState } from 'react';
import { CloudSun, Droplets, Wind, Gauge, Thermometer, Sun } from 'lucide-react';
import type { WeatherData } from '../utils/solarModel';

interface PredictionFormProps {
  onPredict: (data: WeatherData) => void;
  isLoading: boolean;
}

export function PredictionForm({ onPredict, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState<WeatherData>({
    temperature: 25,
    humidity: 60,
    cloudCover: 30,
    windSpeed: 5,
    pressure: 1013,
    solarRadiation: 600
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  const handleChange = (field: keyof WeatherData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">Weather Parameters</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Thermometer className="w-4 h-4 text-orange-500" />
            Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={(e) => handleChange('temperature', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="25.0"
          />
          <p className="text-xs text-slate-500 mt-1">Range: -10 to 45°C</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            Humidity (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.humidity}
            onChange={(e) => handleChange('humidity', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="60"
          />
          <p className="text-xs text-slate-500 mt-1">Range: 0 to 100%</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <CloudSun className="w-4 h-4 text-slate-500" />
            Cloud Cover (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.cloudCover}
            onChange={(e) => handleChange('cloudCover', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="30"
          />
          <p className="text-xs text-slate-500 mt-1">Range: 0 to 100%</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Wind className="w-4 h-4 text-teal-500" />
            Wind Speed (m/s)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.windSpeed}
            onChange={(e) => handleChange('windSpeed', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="5.0"
          />
          <p className="text-xs text-slate-500 mt-1">Range: 0 to 30 m/s</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Gauge className="w-4 h-4 text-slate-700" />
            Pressure (hPa)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.pressure}
            onChange={(e) => handleChange('pressure', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="1013"
          />
          <p className="text-xs text-slate-500 mt-1">Range: 950 to 1050 hPa</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Sun className="w-4 h-4 text-yellow-500" />
            Solar Radiation (W/m²)
          </label>
          <input
            type="number"
            step="1"
            value={formData.solarRadiation}
            onChange={(e) => handleChange('solarRadiation', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="600"
          />
          <p className="text-xs text-slate-500 mt-1">Range: 0 to 1000 W/m²</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Calculating...' : 'Predict Solar Energy Potential'}
      </button>
    </form>
  );
}
