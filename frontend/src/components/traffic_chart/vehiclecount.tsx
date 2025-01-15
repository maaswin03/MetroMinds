import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { TrendingDown } from "lucide-react";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TrafficData {
  date: string;
  vehicleCount: number;
  latitude: number;
  longitude: number;
  trafficDensity: number;
  trafficLevel: string;
}

const chartConfig = {
  vehicleCount: {
    label: "Vehicle Count:",
    color: "hsl(340, 70%, 50%)",
  },
} satisfies ChartConfig;

export function VehicleCountChart() {
  const [Data, setData] = React.useState<TrafficData[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://metrominds.onrender.com/dashboard-data");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data.traffic);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const recentData = Data.slice(0, 14);

  const chartData = recentData.map((item,index) => ({
    location:`Location ${index + 1}`,
    vehicleCount: item.vehicleCount,
  }));

  const totalVehicleCount = chartData?.reduce(
    (sum, data) => sum + data.vehicleCount,
    0
  );
  const averageVehicleCount = (
    totalVehicleCount / chartData.length
  ).toFixed(1);

  const startLocation = chartData[0]?.location || "N/A";
  const endLocation = chartData[chartData.length - 1]?.location || "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Count - Last 7 Locations</CardTitle>
        <CardDescription>
          Vehicle count data from {startLocation} to {endLocation}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              left: -20,
              right: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="location"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis domain={[100, Math.max(...chartData.map(item => item.vehicleCount))]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="vehicleCount"
              type="monotone"
              stroke="var(--color-vehicleCount)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              The Average Vehicle Count is {averageVehicleCount}
              <TrendingDown className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing vehicle count data from {startLocation} to {endLocation}.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
