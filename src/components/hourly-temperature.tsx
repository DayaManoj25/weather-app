import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns"; //for formatting dates
import type { ForecastData } from "@/api/types";

interface HourlyTemperatureProps { //shape of data
  data: ForecastData; //this component expects a prop (input) called data, and it should match the ForecastData type.
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
}

export function HourlyTemperature({ data }: HourlyTemperatureProps) {
  // Get today's forecast data and format for chart

  const chartData: ChartData[] = data.list //contains weather data in 3-hour intervals
    .slice(0, 8) // Get next 24 hours (3-hour intervals)
    .map((item) => ({
      time: format(new Date(item.dt * 1000), "ha"),
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
    })); //creates chart data

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Today's Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%"> 
            {/*Makes the chart resize properly on all screen sizes.*/}
            <LineChart data={chartData}> {/*Line chart for chartData */}
              <XAxis //for graphs
                dataKey="time" //time value on x axis
                stroke="#888888"
                fontSize={12}
                tickLine={true}
                axisLine={true}
              />
              <YAxis //y axis
                stroke="#888888"
                fontSize={12}
                tickLine={true}
                axisLine={true}
                tickFormatter={(value) => `${value}°`}
              /> {/*Just for axes*/}

              <Tooltip //that line - a popup when you hover on the chart.
                content={({ active, payload }) => {
                  if (active && payload && payload.length) { //payload-Is an array of data points for the hovered x-axis value. active-active: true if the tooltip is visible
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Temperature {/* value on the line */}
                            </span>
                            <span className="font-bold">
                              {payload[0].value}°
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Feels Like
                            </span>
                            <span className="font-bold">
                              {payload[1].value}°
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line //for the chart line for temperature
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2}
                dot={true}
              />
              <Line // for feels like
                type="monotone"
                dataKey="feels_like"
                stroke="#64748b"
                strokeWidth={2}
                dot={true}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}