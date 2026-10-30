import { GoogleGenAI, Type } from '@google/genai';
import { WeatherData, WeatherInsights } from '../src/types/weather';

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Generate AI-powered weather insights, outfit tips and outdoor recommendations
 */
export async function generateWeatherInsights(data: WeatherData): Promise<WeatherInsights> {
  const ai = getAiClient();

  // If no Gemini API key configured, return high-quality heuristic insights
  if (!ai) {
    return getFallbackInsights(data);
  }

  try {
    const prompt = `Analyze this live weather report for ${data.location.name}${data.location.country ? ', ' + data.location.country : ''} and generate practical, friendly insights:
- Current condition: ${data.current.condition} (${data.current.temperature}${data.units.temp}, feels like ${data.current.feels_like}${data.units.temp})
- Humidity: ${data.current.humidity}%, Wind: ${data.current.wind_speed} ${data.units.speed} (${data.current.wind_direction_cardinal})
- Precipitation: ${data.current.precipitation} ${data.units.precipitation}, UV Index: ${data.current.uv_index}
- Today's range: ${data.daily[0]?.temp_min ?? data.current.temperature}${data.units.temp} to ${data.daily[0]?.temp_max ?? data.current.temperature}${data.units.temp}
- Next 24h precipitation probability max: ${Math.max(...data.hourly.slice(0, 12).map((h) => h.precipitation_probability))}%

Provide:
1. headline: A concise, memorable 4-8 word atmospheric takeaway.
2. summary: A warm, clear 2-sentence breakdown of what the day will actually feel like.
3. clothingSuggestion: Specific, practical outfit and layering recommendation.
4. activityRecommendation: Best outdoor or indoor activity suggestion for these conditions.
5. bestTimeToGoOut: Recommended time window for being outside (or note if staying inside is better).
6. advisory: One brief tip on UV, wind, rain, hydration, or temperature caution.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are SkyCast AI, a professional meteorology companion. Provide smart, actionable, concise weather advice without robotic fluff.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            summary: { type: Type.STRING },
            clothingSuggestion: { type: Type.STRING },
            activityRecommendation: { type: Type.STRING },
            bestTimeToGoOut: { type: Type.STRING },
            advisory: { type: Type.STRING },
          },
          required: [
            'headline',
            'summary',
            'clothingSuggestion',
            'activityRecommendation',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return getFallbackInsights(data);
    }

    const parsed = JSON.parse(text) as WeatherInsights;
    return parsed;
  } catch (error) {
    console.error('Error generating Gemini weather insights:', error);
    return getFallbackInsights(data);
  }
}

/**
 * High-quality fallback rule-based insights when Gemini key is not configured
 */
function getFallbackInsights(data: WeatherData): WeatherInsights {
  const temp = data.current.temperature;
  const isCelsius = data.units.temp === '°C';
  // Normalize temp to Celsius for comparisons
  const tempC = isCelsius ? temp : ((temp - 32) * 5) / 9;
  const condition = data.current.condition.toLowerCase();
  const uv = data.current.uv_index;
  const pop = data.daily[0]?.precipitation_probability_max ?? 0;

  let headline = `Pleasant conditions in ${data.location.name}`;
  let summary = `Expect ${data.current.condition.toLowerCase()} with temperatures hovering around ${temp}${data.units.temp}.`;
  let clothing = 'Comfortable casual wear with light layers.';
  let activity = 'Great time for an afternoon walk or outdoor stroll.';
  let advisory = uv >= 6 ? 'High UV exposure: apply sunscreen and wear sunglasses.' : 'Conditions are comfortable.';

  if (tempC < 5) {
    headline = `Brisk & chilly in ${data.location.name}`;
    clothing = 'Heavy coat, scarf, gloves, and insulated layers recommended.';
    activity = 'Cozy indoor activities or brief brisk outdoor walks.';
    advisory = 'Stay warm and protect extremities from chill.';
  } else if (tempC < 16) {
    headline = `Cool breeze across ${data.location.name}`;
    clothing = 'Medium jacket, light sweater, or cardigan.';
    activity = 'Ideal for running, cycling, or visiting local sights.';
  } else if (tempC > 28) {
    headline = `Warm & sunny in ${data.location.name}`;
    clothing = 'Breathable lightweight cotton or linen fabrics and sunglasses.';
    activity = 'Early morning outdoor workout or shaded afternoon lounging.';
    advisory = 'Stay hydrated throughout the day and seek shade.';
  }

  if (pop > 60 || condition.includes('rain') || condition.includes('drizzle')) {
    headline = `Showers expected in ${data.location.name}`;
    summary = `Intermittent rain likely today. Temperatures will feel around ${data.current.feels_like}${data.units.temp}.`;
    clothing = 'Waterproof jacket, umbrella, and water-resistant footwear.';
    activity = 'Museum visit, cozy cafe, or indoor workout sessions.';
    advisory = 'Carry an umbrella and watch for slick roadways.';
  } else if (condition.includes('snow')) {
    headline = `Winter snowfall in ${data.location.name}`;
    clothing = 'Thermal underlayers, waterproof winter boots, and down coat.';
    activity = 'Winter photography or relaxing indoor activities.';
    advisory = 'Watch for icy walkways and reduced road visibility.';
  } else if (condition.includes('thunderstorm')) {
    headline = `Thunderstorms developing near ${data.location.name}`;
    clothing = 'Rainproof gear and secure indoor footwear.';
    activity = 'Indoor leisure activities; avoid open outdoor areas.';
    advisory = 'Stay indoors during lightning and monitor storm updates.';
  }

  return {
    headline,
    summary,
    clothingSuggestion: clothing,
    activityRecommendation: activity,
    bestTimeToGoOut: pop < 30 ? 'Mid-morning to early afternoon' : 'Check hourly radar before heading out',
    advisory,
  };
}
