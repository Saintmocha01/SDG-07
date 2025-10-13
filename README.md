# Solar Energy Predictor - SDG 7 Clean Energy

An AI-powered machine learning solution that predicts solar energy potential using weather data, contributing to UN Sustainable Development Goal 7: Affordable and Clean Energy.

## Overview

This application uses supervised learning to analyze weather conditions and predict solar energy output, helping communities and organizations make informed decisions about solar panel deployment. By optimizing solar installation locations and predicting energy generation, this tool supports universal access to reliable, sustainable electricity.

## Features

- **Real-time Solar Predictions**: Input weather parameters to get instant energy output forecasts
- **ML-Driven Analysis**: Weighted linear regression model with six weather features
- **Historical Data Tracking**: View past predictions and analyze trends over time
- **Impact Dashboard**: Calculate total energy potential and homes supported
- **Optimization Recommendations**: Get actionable insights for panel placement and maintenance
- **Confidence Scoring**: Understand prediction reliability based on weather conditions
- **Database Integration**: Persistent storage using Supabase for long-term analysis

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **ML Model**: Supervised learning with feature normalization
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Icons**: Lucide React

## Machine Learning Model

### Algorithm
The model uses weighted linear regression with normalized features to predict solar energy output. Each weather parameter is assigned a scientifically-derived weight based on its impact on solar energy generation.

### Input Features
1. **Solar Radiation** (W/m²) - Weight: +0.85
2. **Cloud Cover** (%) - Weight: -0.65
3. **Temperature** (°C) - Weight: +0.15
4. **Humidity** (%) - Weight: -0.25
5. **Wind Speed** (m/s) - Weight: +0.08
6. **Atmospheric Pressure** (hPa) - Weight: +0.05

### Output Predictions
- Energy Output (kWh per panel)
- Panel Efficiency (%)
- Optimal Panel Angle (degrees)
- Confidence Score (%)
- Actionable Recommendations

### Feature Normalization
All input features are normalized to a 0-1 scale:
- Temperature: -10°C to 45°C
- Humidity: 0% to 100%
- Cloud Cover: 0% to 100%
- Wind Speed: 0 to 30 m/s
- Pressure: 950 to 1050 hPa
- Solar Radiation: 0 to 1000 W/m²

## Database Schema

### Tables

**locations**
- Stores geographic locations for predictions
- Fields: id, name, latitude, longitude, timezone, user_id, created_at

**weather_data**
- Historical weather measurements
- Fields: id, location_id, timestamp, temperature, humidity, cloud_cover, wind_speed, pressure, solar_radiation, created_at

**predictions**
- ML model predictions and results
- Fields: id, location_id, weather_data_id, energy_output, efficiency, optimal_panel_angle, confidence, recommendations, created_at

### Security
All tables have Row Level Security (RLS) enabled:
- Public read access for promoting SDG awareness
- Authenticated users can create and manage their own data

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Usage

1. **Enter Weather Data**: Input current or forecasted weather parameters in the prediction form
2. **Generate Prediction**: Click "Predict Solar Energy Potential" to run the ML model
3. **Review Results**: Analyze energy output, efficiency, and recommendations
4. **Track History**: View past predictions and cumulative impact metrics
5. **Understand the Model**: Read the detailed model explanation section

## API - Edge Function

The application includes a deployed Supabase Edge Function for serverless ML inference:

**Endpoint**: `/functions/v1/solar-predict`

**Method**: POST

**Request Body**:
```json
{
  "temperature": 25,
  "humidity": 60,
  "cloudCover": 30,
  "windSpeed": 5,
  "pressure": 1013,
  "solarRadiation": 600
}
```

**Response**:
```json
{
  "energyOutput": 6.75,
  "efficiency": 18.5,
  "optimalPanelAngle": 35,
  "confidence": 85,
  "recommendations": [...]
}
```

## Project Structure

```
src/
├── components/
│   ├── PredictionForm.tsx      # Weather input form
│   ├── PredictionResults.tsx   # Display predictions
│   ├── HistoricalData.tsx      # Past predictions list
│   ├── ImpactMetrics.tsx       # Dashboard analytics
│   ├── ModelExplanation.tsx    # ML model details
│   └── SDGBanner.tsx           # SDG 7 information
├── utils/
│   └── solarModel.ts           # ML model implementation
├── lib/
│   └── supabase.ts             # Database client
└── App.tsx                     # Main application
```

## SDG 7 Impact

This project contributes to UN Sustainable Development Goal 7 by:

- **Optimizing Solar Deployment**: Identifying best conditions for solar installations
- **Improving Energy Access**: Helping communities plan reliable renewable energy systems
- **Data-Driven Decisions**: Providing evidence-based recommendations for clean energy adoption
- **Efficiency Gains**: Maximizing energy output through optimal panel positioning
- **Scalability**: Enabling predictions for any geographic location with weather data

## Data Sources

This application can integrate with various weather data sources:
- UN Stats SDG Database: https://unstats.un.org/sdgs/indicators/database/
- OpenWeatherMap API
- National weather services
- Local weather stations

## Future Enhancements

- Integration with real-time weather APIs
- Multi-location comparison and ranking
- Seasonal trend analysis and forecasting
- Cost-benefit analysis for solar installations
- Mobile application for field assessments
- Advanced ML models (neural networks, ensemble methods)
- Integration with energy grid data

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is created for educational purposes as part of SDG-focused AI development.

## Acknowledgments

- UN Sustainable Development Goals framework
- Open-source weather data providers
- Supabase for database and edge function infrastructure
- React and TypeScript communities

---

**Built with purpose to support SDG 7: Ensure access to affordable, reliable, sustainable and modern energy for all**
