import { Brain, Database, Zap, Target } from 'lucide-react';

export function ModelExplanation() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <Brain className="w-6 h-6 text-blue-600" />
        Machine Learning Model Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Input Features</h3>
          </div>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Solar Radiation</strong> (W/m²): Primary energy source indicator</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Cloud Cover</strong> (%): Reduces available sunlight</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Temperature</strong> (°C): Affects panel efficiency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Humidity</strong> (%): Impacts atmospheric clarity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Wind Speed</strong> (m/s): Cooling effect on panels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Pressure</strong> (hPa): Weather stability indicator</span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-slate-900">Output Predictions</h3>
          </div>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span><strong>Energy Output</strong>: Predicted kWh per panel</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span><strong>Efficiency</strong>: Panel conversion rate percentage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span><strong>Optimal Angle</strong>: Best panel tilt for location</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span><strong>Confidence Score</strong>: Prediction reliability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span><strong>Recommendations</strong>: Actionable insights</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-slate-700" />
          <h3 className="text-lg font-semibold text-slate-900">Algorithm Approach</h3>
        </div>
        <div className="space-y-4 text-slate-700">
          <p>
            <strong>Supervised Learning:</strong> This model uses weighted linear regression with feature normalization
            to predict solar energy output. Each weather parameter is assigned a scientifically-derived weight based on
            its impact on solar energy generation.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-slate-600">Solar Radiation</p>
              <p className="text-lg font-bold text-green-600">+0.85</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-slate-600">Cloud Cover</p>
              <p className="text-lg font-bold text-red-600">-0.65</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-slate-600">Humidity</p>
              <p className="text-lg font-bold text-orange-600">-0.25</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-slate-600">Temperature</p>
              <p className="text-lg font-bold text-blue-600">+0.15</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-slate-600">Wind Speed</p>
              <p className="text-lg font-bold text-teal-600">+0.08</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-slate-600">Pressure</p>
              <p className="text-lg font-bold text-slate-600">+0.05</p>
            </div>
          </div>
          <p className="mt-4">
            <strong>Normalization:</strong> All input features are normalized to a 0-1 scale to ensure fair weighting.
            The model applies domain constraints to ensure predictions remain within realistic bounds (0-10 kWh per panel).
          </p>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h4 className="font-semibold text-slate-900 mb-2">Real-World Application</h4>
        <p className="text-slate-700">
          This model helps communities and energy planners identify optimal locations for solar installations,
          predict daily energy output, and make informed decisions about renewable energy investments.
          By improving solar deployment efficiency, we contribute to SDG 7's goal of ensuring universal access
          to affordable, reliable, and sustainable energy.
        </p>
      </div>
    </div>
  );
}
