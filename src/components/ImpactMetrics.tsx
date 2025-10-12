import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, TrendingUp, Battery, Home } from 'lucide-react';

export function ImpactMetrics() {
  const [metrics, setMetrics] = useState({
    totalPredictions: 0,
    averageOutput: 0,
    totalEnergy: 0,
    homesSupported: 0
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('energy_output');

      if (error) throw error;

      if (data && data.length > 0) {
        const totalEnergy = data.reduce((sum, p) => sum + p.energy_output, 0);
        const averageOutput = totalEnergy / data.length;
        const homesSupported = Math.floor(totalEnergy / 30);

        setMetrics({
          totalPredictions: data.length,
          averageOutput: Math.round(averageOutput * 100) / 100,
          totalEnergy: Math.round(totalEnergy * 100) / 100,
          homesSupported
        });
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-200 p-8">
      <h3 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-green-600" />
        Impact Dashboard
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-slate-600">Predictions</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{metrics.totalPredictions}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-slate-600">Avg Output</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{metrics.averageOutput}</p>
          <p className="text-xs text-slate-500">kWh</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="w-5 h-5 text-green-600" />
            <p className="text-sm text-slate-600">Total Energy</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{metrics.totalEnergy}</p>
          <p className="text-xs text-slate-500">kWh</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-slate-600">Homes</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{metrics.homesSupported}</p>
          <p className="text-xs text-slate-500">supported</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg">
        <p className="text-sm text-slate-600">
          Based on average household consumption of 30 kWh per day, this predicted energy could support{' '}
          <strong className="text-green-700">{metrics.homesSupported} homes</strong> for one day,
          helping achieve SDG 7 targets for affordable and clean energy access.
        </p>
      </div>
    </div>
  );
}
