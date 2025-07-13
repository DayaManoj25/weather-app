export const API_CONFIG = {
    BASE_URL: "https://api.openweathermap.org/data/2.5", //base url of the api
    GEO: "https://api.openweathermap.org/geo/1.0", //base url for geocoding
    API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY, //fetches your API key from your environment file
    DEFAULT_PARAMS: { //Default query parameters you will use with every API call.
        units: "metric",
        appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
    }
}

/*Purpose of API_CONFIG:
Centralizes all your weather API configuration.
Makes code cleaner and reusable.

What each key does:
BASE_URL: For weather and forecast endpoints.
GEO: For reverse geocoding endpoints.
API_KEY: Securely fetches your API key.
DEFAULT_PARAMS: Keeps units in metric consistently.*/