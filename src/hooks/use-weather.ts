//CREATION OF QUERIES

/*It contains reusable React Query hooks to fetch:
    Current weather data
    Forecast data
    Reverse geocode place name*/

import type { Coordinates } from "@/api/types";
import { weatherAPI } from "@/api/weather"; // Imports your weatherAPI object
import { useQuery } from "@tanstack/react-query"; //Imports the useQuery hook from TanStack React Query to fetch data, manage loading, errors, and caching automatically.

//query keys for Identify cached data uniquely.Avoid duplicate API calls for the same coordinates.
export const WEATHER_KEYS={
    weather: (coords: Coordinates)=>["weather", coords] as const,
    forecast: (coords: Coordinates)=>["forecast", coords] as const,
    location: (coords: Coordinates)=>["location", coords] as const,
    search: (query:string) => ["location-search", query] as const,
} as const;

//Every single query has a query key  


export function useWeatherQuery(coordinates: Coordinates | null){
    return useQuery({  //runs api call
        queryKey: WEATHER_KEYS.weather(coordinates ?? { lat:0, lon:0 }), //uses the coordinates to uniquely identify this fetch.
        queryFn: () => // function that actually calls your weather API if coordinates are available.
            coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
        enabled:!!coordinates, //query runs only 
    });
}
//weather and forecast- meaning predication for future
//fetch forecast
export function useForecastQuery(coordinates: Coordinates | null){
    return useQuery({ 
        queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat:0, lon:0 }),
        queryFn: () =>
            (coordinates ? weatherAPI.getForecast(coordinates) : null),
        enabled:!!coordinates,
    });
}

//Fetch place name (city, area) from coordinates
export function useReverseGeocodeQuery(coordinates: Coordinates | null){
    return useQuery({ 
        queryKey: WEATHER_KEYS.location(coordinates ?? { lat:0, lon:0 }),
        queryFn: () =>
            coordinates?weatherAPI.reverseGeocode(coordinates) : null,
        enabled:!!coordinates,
    });
}

export function useLocationSearch(query: string){
    return useQuery({ 
        queryKey: WEATHER_KEYS.search(query),
        queryFn: () => weatherAPI.searchLocations(query),
        enabled: query.length >= 3,
    });
}