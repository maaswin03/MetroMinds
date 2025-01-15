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

interface earthquakeData {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  date: string;
  latitude: number;
  longitude: number;
  strain: number;
  vibrationIntensity: number;
}

const chartConfig = {
  vibrationIntensity: {
    label: "Vibration Intensity:",
    color: "hsl(340, 70%, 50%)",
  },
} satisfies ChartConfig;

export function VibrationIntensity() {
  const [Data, setData] = React.useState<earthquakeData[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://metrominds.onrender.com/dashboard-data");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data.earthquake);
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
    vibrationIntensity: item.vibrationIntensity,
  }));

  const totalvibrationIntensity = chartData?.reduce(
    (sum, data) => sum + data.vibrationIntensity,
    0
  );
  const averagevibrationIntensity = (
    totalvibrationIntensity / chartData.length
  ).toFixed(1);

  const startDate = chartData[0]?.date || "N/A";
  const endDate = chartData[chartData.length - 1]?.date || "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vibration Intensity (m/s) - Last 7 Days</CardTitle>
        <CardDescription>
          Vibration Intensity for each day from {endDate} to {startDate}
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
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis domain={[0, 6]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="vibrationIntensity"
              type="monotone"
              stroke="var(--color-vibrationIntensity)"
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
              The Average Vibration Intensity  is {averagevibrationIntensity}
              <TrendingDown className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing Vibration Intensity  for each day from {endDate} to {startDate}
              .
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
