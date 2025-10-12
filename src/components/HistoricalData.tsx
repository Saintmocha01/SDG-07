import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';

interface HistoricalPrediction {
  id: string;
  energy_output: number;
  efficiency: number;
  confidence: number;
  created_at: string;
}

export function HistoricalData() {
  const [predictions, setPredictions] = useState<HistoricalPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistoricalData();
  }, []);

  const loadHistoricalData = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('id, energy_output, efficiency, confidence, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPredictions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const calculateAverage = () => {
    if (predictions.length === 0) return 0;
    const sum = predictions.reduce((acc, p) => acc + p.energy_output, 0);
    return (sum / predictions.length).toFixed(2);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl border border-red-200 p-8">
        <div className="flex items-center gap-3 text-red-800">
          <AlertCircle className="w-6 h-6" />
          <span>Error loading historical data: {error}</span>
        </div>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
        <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600">No predictions yet. Make your first prediction above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Recent Predictions
        </h3>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-xs text-slate-600">Average Output</p>
            <p className="text-lg font-bold text-blue-600">{calculateAverage()} kWh</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {predictions.map((pred) => (
          <div
            key={pred.id}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500">
                {formatDate(pred.created_at)}
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-600">Energy Output</p>
                  <p className="text-lg font-semibold text-slate-900">{pred.energy_output} kWh</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Efficiency</p>
                  <p className="text-lg font-semibold text-slate-900">{pred.efficiency}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Confidence</p>
                  <p className="text-lg font-semibold text-slate-900">{pred.confidence}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
