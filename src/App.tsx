import { useState } from 'react';
import { Sun } from 'lucide-react';
import { PredictionForm } from './components/PredictionForm';
import { PredictionResults } from './components/PredictionResults';
import { SDGBanner } from './components/SDGBanner';
import { HistoricalData } from './components/HistoricalData';
import { ImpactMetrics } from './components/ImpactMetrics';
import { ModelExplanation } from './components/ModelExplanation';
import { solarModel, type WeatherData, type SolarPrediction } from './utils/solarModel';
import { supabase } from './lib/supabase';

function App() {
  const [prediction, setPrediction] = useState<SolarPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handlePredict = async (weatherData: WeatherData) => {
    setIsLoading(true);

    try {
      const result = solarModel.predict(weatherData);
      setPrediction(result);

      const defaultLocationId = '00000000-0000-0000-0000-000000000001';

      const { data: locationData, error: locationError } = await supabase
        .from('locations')
        .select('id')
        .eq('id', defaultLocationId)
        .maybeSingle();

      let locationId = locationData?.id;

      if (!locationData || locationError) {
        const { data: newLocation, error: createError } = await supabase
          .from('locations')
          .insert([{
            id: defaultLocationId,
            name: 'Demo Location',
            latitude: 35.0,
            longitude: -95.0,
            timezone: 'UTC'
          }])
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating location:', createError);
        } else {
          locationId = newLocation?.id;
        }
      }

      if (locationId) {
        const { data: weatherRecord, error: weatherError } = await supabase
          .from('weather_data')
          .insert([{
            location_id: locationId,
            timestamp: new Date().toISOString(),
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            cloud_cover: weatherData.cloudCover,
            wind_speed: weatherData.windSpeed,
            pressure: weatherData.pressure,
            solar_radiation: weatherData.solarRadiation
          }])
          .select('id')
          .single();

        if (weatherError) {
          console.error('Error saving weather data:', weatherError);
        } else if (weatherRecord) {
          const { error: predictionError } = await supabase
            .from('predictions')
            .insert([{
              location_id: locationId,
              weather_data_id: weatherRecord.id,
              energy_output: result.energyOutput,
              efficiency: result.efficiency,
              optimal_panel_angle: result.optimalPanelAngle,
              confidence: result.confidence,
              recommendations: result.recommendations
            }]);

          if (predictionError) {
            console.error('Error saving prediction:', predictionError);
          } else {
            setRefreshHistory(prev => prev + 1);
          }
        }
      }
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sun className="w-16 h-16 text-yellow-500" />
            <h1 className="text-5xl font-bold text-slate-900">Solar Energy Predictor</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            AI-powered solution for predicting solar energy potential from weather data
          </p>
        </header>

        <SDGBanner />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <PredictionForm onPredict={handlePredict} isLoading={isLoading} />
          </div>

          <div>
            {prediction ? (
              <PredictionResults prediction={prediction} />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <Sun className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">Enter weather parameters to see predictions</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <ImpactMetrics key={refreshHistory} />
        </div>

        <div className="mb-8">
          <HistoricalData key={refreshHistory} />
        </div>

        <div className="mb-8">
          <ModelExplanation />
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">About This Project</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed mb-4">
              This machine learning application addresses <strong>UN Sustainable Development Goal 7: Affordable and Clean Energy</strong> by
              predicting solar energy potential based on weather conditions. The supervised learning model analyzes six key weather parameters
              to forecast energy output, helping communities and organizations make informed decisions about solar panel deployment.
            </p>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">How It Works</h3>
            <ul className="space-y-2 text-slate-700">
              <li><strong>Data Input:</strong> The model accepts weather parameters including temperature, humidity, cloud cover, wind speed, atmospheric pressure, and solar radiation</li>
              <li><strong>ML Algorithm:</strong> Uses weighted linear regression with normalized features to predict energy output</li>
              <li><strong>Output:</strong> Provides energy output predictions (kWh), panel efficiency, optimal installation angle, and actionable recommendations</li>
              <li><strong>Impact:</strong> Helps identify optimal locations and conditions for solar installations, improving access to reliable electricity</li>
            </ul>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Key Features</h3>
            <ul className="space-y-2 text-slate-700">
              <li>Real-time solar energy predictions based on weather conditions</li>
              <li>Historical data tracking and trend analysis</li>
              <li>Confidence scoring for prediction reliability</li>
              <li>Actionable recommendations for solar panel optimization</li>
              <li>Database integration for long-term analysis</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
