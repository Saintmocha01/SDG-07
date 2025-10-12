import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  user_id?: string;
  created_at: string;
}

export interface WeatherDataRecord {
  id: string;
  location_id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  cloud_cover: number;
  wind_speed: number;
  pressure: number;
  solar_radiation: number;
  created_at: string;
}

export interface PredictionRecord {
  id: string;
  location_id: string;
  weather_data_id: string;
  energy_output: number;
  efficiency: number;
  optimal_panel_angle: number;
  confidence: number;
  recommendations: string[];
  created_at: string;
}
