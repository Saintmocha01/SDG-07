import { Zap, TrendingUp, Compass, Target, Lightbulb } from 'lucide-react';
import type { SolarPrediction } from '../utils/solarModel';

interface PredictionResultsProps {
  prediction: SolarPrediction;
}

export function PredictionResults({ prediction }: PredictionResultsProps) {
  const getEnergyColor = (output: number) => {
    if (output >= 7) return 'text-green-600';
    if (output >= 4) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getEnergyBg = (output: number) => {
    if (output >= 7) return 'bg-green-50 border-green-200';
    if (output >= 4) return 'bg-yellow-50 border-yellow-200';
    return 'bg-orange-50 border-orange-200';
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border-2 ${getEnergyBg(prediction.energyOutput)} p-8 shadow-sm`}>
        <div className="flex items-center gap-3 mb-4">
          <Zap className={`w-8 h-8 ${getEnergyColor(prediction.energyOutput)}`} />
          <h3 className="text-2xl font-semibold text-slate-900">Predicted Energy Output</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-6xl font-bold ${getEnergyColor(prediction.energyOutput)}`}>
            {prediction.energyOutput}
          </span>
          <span className="text-2xl text-slate-600">kWh per panel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h4 className="text-sm font-medium text-slate-600">Panel Efficiency</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">{prediction.efficiency}%</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <Compass className="w-6 h-6 text-teal-600" />
            <h4 className="text-sm font-medium text-slate-600">Optimal Panel Angle</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">{prediction.optimalPanelAngle}°</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-emerald-600" />
            <h4 className="text-sm font-medium text-slate-600">Confidence Score</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">{prediction.confidence}%</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl border border-blue-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-blue-600" />
          <h4 className="text-xl font-semibold text-slate-900">Recommendations</h4>
        </div>
        <ul className="space-y-3">
          {prediction.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                {index + 1}
              </span>
              <span className="text-slate-700 leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
