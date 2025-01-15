import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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

interface flooddata {
  airTemperature: number;
  date: string;
  flowRate: number;
  latitude: number;
  longitude: number;
  rainfallIntensity: number;
  soilMoisture: number;
  waterLevel: number;
}

const chartConfig = {
  SoilMoisture: {
    label: "SoilMoisture :",
    color: "hsl(200, 70%, 50%)",
  },
} satisfies ChartConfig;

export function SoilMoisture() {
  const [Data, setData] = React.useState<flooddata[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://metrominds.onrender.com/dashboard-data"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data.flood);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const recentData = Data.slice(0, 7);

  const chartData = recentData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    soilMoisture: item.soilMoisture,
  }));

  const totalsoilMoisture = chartData?.reduce(
    (sum, data) => sum + data.soilMoisture,
    0
  );
  const averagesoilMoisture = (
    totalsoilMoisture / chartData.length
  ).toFixed(1);

  const startDate = chartData[0]?.date || "N/A";
  const endDate = chartData[chartData.length - 1]?.date || "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soil Moisture (%) - Last 7 Days</CardTitle>
        <CardDescription>
        SoilMoisture for each day from {endDate} to Jan {startDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              left: -30,
              right: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="soilMoisture"
              type="monotone"
              stroke="var(--color-SoilMoisture)"
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
              The Average Soil Moisture score is {averagesoilMoisture}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing Soil Moisture for each day from {endDate} to {startDate}.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
