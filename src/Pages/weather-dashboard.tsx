import { Button } from "@/components/ui/button"
import { useGeolocation } from "@/hooks/use-geolocation"
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react"
import WeatherSkeleton from "@/components/loading-skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather"
import CurrentWeather from "@/components/current-weather"
import { HourlyTemperature } from "@/components/hourly-temperature"
import WeatherDetails from "@/components/weather-details"
import WeatherForecast from "@/components/weather-forecast"
import { FavoriteCities } from "@/components/favorite-cities"

const WeatherDashboard = () => {
  //location retrival
  const{
    coordinates, //gets lat and lon
    error: locationError, //no permission for location
    getLocation, //retry getting location
    isLoading: locationLoading //trying to get location
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates); //gets current weather
  const forecastQuery = useForecastQuery(coordinates); //gets future weather
  const locationQuery = useReverseGeocodeQuery(coordinates);  // reverse coords to place name

  const handleRefresh=()=>{ //Gets latest location again.
    getLocation();
    
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    
  };

  if (locationLoading){
    return <WeatherSkeleton/> // location is still being fetched, show the loader.
  }

  if (locationError){ //if location fetching failed
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
  )}

  if (!coordinates){ //If location is not available, prompt the user to enable location.
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather.</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
  )}
  /*locationQuery.data?.[0] means:
  If locationQuery.data exists, 
  return the first element ([0]).
  If locationQuery.data is undefined or null, 
  return undefined safely without throwing an error.*/

  const locationName = locationQuery.data?.[0];

  //error in loading weather or forecast API
  if (weatherQuery.error || forecastQuery.error){
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again.</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
  )
  }

  //loading
  if (!weatherQuery.data || !forecastQuery.data){
    return <WeatherSkeleton/>
  }

  console.log("isFetching:", weatherQuery.isFetching);


  {/*✅ Simple flow:
  User’s phone → gives latitude/longitude →
  Reverse Geocoding API → gives place name →
  Weather API → gives weather for that place.*/}
  return (
    <div className="space-y-4">
      <FavoriteCities/>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button variant={'outline'}
        size={"icon"}
        onClick={handleRefresh}
        disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${
            weatherQuery.isFetching ? "animate-spin" : ""}`} />

        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather 
          data ={weatherQuery.data} 
          locationName = {locationName}/>
          <HourlyTemperature data={forecastQuery.data}/>
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data}/>
          <WeatherForecast data={forecastQuery.data}/>
        </div>
      </div>
    </div>
  )
}

export default WeatherDashboard
