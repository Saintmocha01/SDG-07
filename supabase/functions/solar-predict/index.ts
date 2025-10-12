import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface WeatherData {
  temperature: number;
  humidity: number;
  cloudCover: number;
  windSpeed: number;
  pressure: number;
  solarRadiation: number;
}

interface SolarPrediction {
  energyOutput: number;
  efficiency: number;
  optimalPanelAngle: number;
  confidence: number;
  recommendations: string[];
}

class SolarEnergyModel {
  private weights = {
    solarRadiation: 0.85,
    cloudCover: -0.65,
    temperature: 0.15,
    humidity: -0.25,
    windSpeed: 0.08,
    pressure: 0.05,
    bias: 2.5
  };

  normalize(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  predict(data: WeatherData): SolarPrediction {
    const normalizedTemp = this.normalize(data.temperature, -10, 45);
    const normalizedHumidity = this.normalize(data.humidity, 0, 100);
    const normalizedCloudCover = this.normalize(data.cloudCover, 0, 100);
    const normalizedWindSpeed = this.normalize(data.windSpeed, 0, 30);
    const normalizedPressure = this.normalize(data.pressure, 950, 1050);
    const normalizedRadiation = this.normalize(data.solarRadiation, 0, 1000);

    const rawOutput =
      (normalizedRadiation * this.weights.solarRadiation) +
      (normalizedCloudCover * this.weights.cloudCover) +
      (normalizedTemp * this.weights.temperature) +
      (normalizedHumidity * this.weights.humidity) +
      (normalizedWindSpeed * this.weights.windSpeed) +
      (normalizedPressure * this.weights.pressure) +
      this.weights.bias;

    const energyOutput = Math.max(0, Math.min(10, rawOutput * 2.5));

    const efficiency = this.calculateEfficiency(data);
    const optimalAngle = this.calculateOptimalAngle();
    const confidence = this.calculateConfidence(data);
    const recommendations = this.generateRecommendations(data, energyOutput);

    return {
      energyOutput: Math.round(energyOutput * 100) / 100,
      efficiency: Math.round(efficiency * 100) / 100,
      optimalPanelAngle: Math.round(optimalAngle),
      confidence: Math.round(confidence * 100) / 100,
      recommendations
    };
  }

  private calculateEfficiency(data: WeatherData): number {
    const baseEfficiency = 0.20;
    const tempPenalty = Math.max(0, (data.temperature - 25) * 0.004);
    const cloudPenalty = (data.cloudCover / 100) * 0.15;
    const humidityPenalty = (data.humidity / 100) * 0.05;
    const efficiency = baseEfficiency - tempPenalty - cloudPenalty - humidityPenalty;
    return Math.max(0.05, Math.min(0.25, efficiency)) * 100;
  }

  private calculateOptimalAngle(): number {
    const latitude = 35;
    const seasonalAdjustment = Math.sin(Date.now() / (365 * 24 * 60 * 60 * 1000) * 2 * Math.PI) * 15;
    return Math.max(15, Math.min(60, latitude + seasonalAdjustment));
  }

  private calculateConfidence(data: WeatherData): number {
    let confidence = 0.85;
    if (data.cloudCover > 70) confidence -= 0.15;
    if (data.solarRadiation < 200) confidence -= 0.10;
    if (data.humidity > 80) confidence -= 0.05;
    return Math.max(0.5, Math.min(0.95, confidence)) * 100;
  }

  private generateRecommendations(data: WeatherData, energyOutput: number): string[] {
    const recommendations: string[] = [];

    if (energyOutput > 7) {
      recommendations.push("Excellent conditions for solar energy generation");
    } else if (energyOutput > 4) {
      recommendations.push("Good solar energy potential today");
    } else {
      recommendations.push("Moderate solar conditions - consider backup energy sources");
    }

    if (data.cloudCover > 60) {
      recommendations.push("High cloud cover detected - expect reduced output");
    }

    if (data.temperature > 35) {
      recommendations.push("High temperature may reduce panel efficiency - ensure proper ventilation");
    }

    if (data.solarRadiation > 700) {
      recommendations.push("Peak solar radiation period - optimal time for energy collection");
    }

    if (data.humidity > 75) {
      recommendations.push("High humidity detected - regular panel cleaning recommended");
    }

    return recommendations;
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const weatherData: WeatherData = await req.json();

    if (!weatherData.temperature || !weatherData.solarRadiation) {
      return new Response(
        JSON.stringify({ error: "Missing required weather parameters" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const model = new SolarEnergyModel();
    const prediction = model.predict(weatherData);

    return new Response(
      JSON.stringify(prediction),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});