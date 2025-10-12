/*
  # Solar Energy Prediction System - Database Schema

  ## Overview
  This migration creates the database schema for storing solar energy predictions,
  historical weather data, and user locations for the SDG 7 Clean Energy ML application.

  ## New Tables

  ### 1. `locations`
  Stores geographic locations for solar predictions
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Location name (e.g., "Los Angeles, CA")
  - `latitude` (numeric) - Geographic latitude
  - `longitude` (numeric) - Geographic longitude
  - `timezone` (text) - IANA timezone identifier
  - `created_at` (timestamptz) - Record creation timestamp
  - `user_id` (uuid, nullable) - Associated user for authenticated users

  ### 2. `weather_data`
  Stores historical and real-time weather data
  - `id` (uuid, primary key) - Unique identifier
  - `location_id` (uuid, foreign key) - Reference to locations table
  - `timestamp` (timestamptz) - Data collection timestamp
  - `temperature` (numeric) - Temperature in Celsius
  - `humidity` (numeric) - Humidity percentage (0-100)
  - `cloud_cover` (numeric) - Cloud cover percentage (0-100)
  - `wind_speed` (numeric) - Wind speed in m/s
  - `pressure` (numeric) - Atmospheric pressure in hPa
  - `solar_radiation` (numeric) - Solar radiation in W/m²
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `predictions`
  Stores ML model predictions for solar energy output
  - `id` (uuid, primary key) - Unique identifier
  - `location_id` (uuid, foreign key) - Reference to locations table
  - `weather_data_id` (uuid, foreign key) - Reference to weather_data table
  - `energy_output` (numeric) - Predicted energy output in kWh
  - `efficiency` (numeric) - Predicted panel efficiency percentage
  - `optimal_panel_angle` (numeric) - Recommended panel angle in degrees
  - `confidence` (numeric) - Prediction confidence score (0-100)
  - `recommendations` (jsonb) - Array of recommendation strings
  - `created_at` (timestamptz) - Prediction timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for anonymous users (promoting SDG awareness)
  - Authenticated users can create and manage their own data
  - All tables include proper indexes for performance

  ## Important Notes
  1. All numeric values use appropriate precision for scientific data
  2. Timestamps use timestamptz for timezone awareness
  3. JSONB used for flexible recommendation storage
  4. Foreign key constraints ensure data integrity
*/

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude numeric(10, 6) NOT NULL,
  longitude numeric(10, 6) NOT NULL,
  timezone text DEFAULT 'UTC',
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL,
  temperature numeric(5, 2) NOT NULL,
  humidity numeric(5, 2) NOT NULL CHECK (humidity >= 0 AND humidity <= 100),
  cloud_cover numeric(5, 2) NOT NULL CHECK (cloud_cover >= 0 AND cloud_cover <= 100),
  wind_speed numeric(5, 2) NOT NULL CHECK (wind_speed >= 0),
  pressure numeric(6, 2) NOT NULL,
  solar_radiation numeric(7, 2) NOT NULL CHECK (solar_radiation >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  weather_data_id uuid REFERENCES weather_data(id) ON DELETE CASCADE,
  energy_output numeric(8, 2) NOT NULL,
  efficiency numeric(5, 2) NOT NULL,
  optimal_panel_angle numeric(5, 2) NOT NULL,
  confidence numeric(5, 2) NOT NULL,
  recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_weather_data_location_id ON weather_data(location_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_timestamp ON weather_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_location_id ON predictions(location_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations(user_id);

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for locations table
CREATE POLICY "Anyone can view locations"
  ON locations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create locations"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own locations"
  ON locations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own locations"
  ON locations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for weather_data table
CREATE POLICY "Anyone can view weather data"
  ON weather_data FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create weather data"
  ON weather_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for predictions table
CREATE POLICY "Anyone can view predictions"
  ON predictions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (true);
