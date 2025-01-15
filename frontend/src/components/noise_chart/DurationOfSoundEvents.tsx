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

interface Noisedata {
  date: string;
  peakSoundLevel: number;
  latitude: number;
  longitude: number;
  noiseLevel: number;
  durationOfSoundEvents: number;
}

const chartConfig = {
  durationOfSoundEvents: {
    label: "Duration of Sound Events (seconds)",
    color: "hsl(120, 70%, 50%)", // Example color for duration of sound events
  },
} satisfies ChartConfig;

export function DurationOfSoundEvents() {
  const [Data, setData] = React.useState<Noisedata[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://metrominds.onrender.com/dashboard-data");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data.noise); // Assuming the data contains 'noise' for sound-related data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = Data.map((item, index) => ({
    location: `Location ${index + 1}`,
    durationOfSoundEvents: item.durationOfSoundEvents,
  }));

  const totalDuration = chartData.reduce(
    (sum, data) => sum + data.durationOfSoundEvents,
    0
  );
  const averageDuration = (totalDuration / chartData.length).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Duration of Sound Events (seconds) - For 14 Locations</CardTitle>
        <CardDescription>
          Duration of sound events recorded at various locations on {Data[0]?.date || "NA"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="category"
              dataKey="location"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              type="number"
              domain={[0, Math.max(...chartData.map((d) => d.durationOfSoundEvents)) + 10]} // Adjust based on duration range
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="durationOfSoundEvents"
              type="monotone"
              stroke="var(--color-durationOfSoundEvents)"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              The Average Duration of Sound Events is {averageDuration} seconds
              <TrendingDown className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing Duration of Sound Events for all 14 locations on{" "}
              {Data[0]?.date || "NA"}.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
