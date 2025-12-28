import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENWEATHERMAP_API_KEY = Deno.env.get('OPENWEATHERMAP_API_KEY');
const BASE_URL = 'https://api.openweathermap.org';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, city, lat, lon } = await req.json();
    console.log(`Weather API request: action=${action}, city=${city}, lat=${lat}, lon=${lon}`);

    if (!OPENWEATHERMAP_API_KEY) {
      throw new Error('OpenWeatherMap API key not configured');
    }

    let result;

    switch (action) {
      case 'search': {
        // Search for city suggestions using Geocoding API
        if (!city || city.length < 2) {
          return new Response(JSON.stringify({ cities: [] }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const geoUrl = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${OPENWEATHERMAP_API_KEY}`;
        console.log('Fetching city suggestions...');
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        
        if (!geoResponse.ok) {
          console.error('Geocoding API error:', geoData);
          throw new Error(geoData.message || 'Failed to search cities');
        }
        
        const cities = geoData.map((item: any) => ({
          name: item.name,
          country: item.country,
          state: item.state || '',
          lat: item.lat,
          lon: item.lon,
        }));
        
        result = { cities };
        break;
      }

      case 'weather': {
        // Get current weather and forecast
        let weatherLat = lat;
        let weatherLon = lon;

        // If city is provided, first geocode it
        if (city && !lat && !lon) {
          const geoUrl = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`;
          console.log('Geocoding city:', city);
          const geoResponse = await fetch(geoUrl);
          const geoData = await geoResponse.json();
          
          if (!geoResponse.ok || !geoData.length) {
            console.error('City not found:', city);
            throw new Error('City not found');
          }
          
          weatherLat = geoData[0].lat;
          weatherLon = geoData[0].lon;
        }

        if (!weatherLat || !weatherLon) {
          throw new Error('Location coordinates required');
        }

        // Fetch current weather
        const currentUrl = `${BASE_URL}/data/2.5/weather?lat=${weatherLat}&lon=${weatherLon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
        console.log('Fetching current weather...');
        const currentResponse = await fetch(currentUrl);
        const currentData = await currentResponse.json();

        if (!currentResponse.ok) {
          console.error('Weather API error:', currentData);
          throw new Error(currentData.message || 'Failed to fetch weather');
        }

        // Fetch 5-day forecast
        const forecastUrl = `${BASE_URL}/data/2.5/forecast?lat=${weatherLat}&lon=${weatherLon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
        console.log('Fetching forecast...');
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        if (!forecastResponse.ok) {
          console.error('Forecast API error:', forecastData);
          throw new Error(forecastData.message || 'Failed to fetch forecast');
        }

        result = {
          current: currentData,
          forecast: forecastData,
        };
        break;
      }

      case 'reverse-geocode': {
        // Reverse geocode coordinates to get city name
        if (!lat || !lon) {
          throw new Error('Coordinates required for reverse geocoding');
        }
        
        const reverseUrl = `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`;
        console.log('Reverse geocoding coordinates...');
        const reverseResponse = await fetch(reverseUrl);
        const reverseData = await reverseResponse.json();
        
        if (!reverseResponse.ok || !reverseData.length) {
          console.error('Reverse geocoding error:', reverseData);
          throw new Error('Failed to reverse geocode location');
        }
        
        result = {
          name: reverseData[0].name,
          country: reverseData[0].country,
          state: reverseData[0].state || '',
        };
        break;
      }

      default:
        throw new Error('Invalid action');
    }

    console.log('Weather API request successful');
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in weather function:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
