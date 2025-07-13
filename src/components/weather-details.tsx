import type { WeatherData } from "@/api/types"
import { format } from "date-fns";
import { Compass, Gauge, Sunrise, Sunset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WeatherDetailsProps{
    data: WeatherData;
}

const WeatherDetails = ({ data }: WeatherDetailsProps) => {

    const { wind, main, sys } = data;
    
    //format time using date-fns
    const formatTime = (timestamp: number) => {
        return format(new Date(timestamp * 1000), "h:mm a");
    }

    //convert wind degree to direction
    //It converts a wind direction in degrees (0–360°) to an index (0–7)
        const getWindDirection = (degree: number) => {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        //Ensures the value is within 0 to 359.
        //Handles negative degrees.
        //Each 45° section to 1 unit.
        //this gives values between 0 to 7 accordingly position
        const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
        return directions[index];
    }

    const details = [
        {
            title: "Sunrise",
            value: formatTime(sys.sunrise),
            icon: Sunrise,
            color: "text-orange-500",
        },
        {
            title: "Sunset",
            value: formatTime(sys.sunset),
            icon: Sunset,
            color: "text-blue-500",
        },
        {
            title: "Wind Direction",
            value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
            icon: Compass,
            color: "text-green-500",
        },
        {
            title: "Pressure",
            value: `${main.pressure} hPa`,
            icon: Gauge,
            color: "text-purple-500",
        }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weather Details</CardTitle>
            </CardHeader>
        <CardContent>
            {/*For each one key would be different*/}
            <div className="grid gap-6 sm:grid-cols-2">
                {details.map((detail) => (
                    //gap - space between items
                    <div key={detail.title} className="flex items-center gap-3 rounded-lg border p-4">
                        <detail.icon className={`h-5 w-5 ${detail.color}`} />
                        <div>
                            <p className="text-sm font-medium leading-none">
                                {detail.title}
                            </p>
                            <p className="text-sm text-muted-foreground">{detail.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
  )
}

export default WeatherDetails
