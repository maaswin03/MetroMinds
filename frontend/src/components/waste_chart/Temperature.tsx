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

interface Wastedata {
  date: string;
  temperature: number;
  latitude: number;
  longitude: number;
  totalWeight: number;
  metersFilled: number;
  fire: boolean;
}

const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(340, 70%, 50%)",
  },
} satisfies ChartConfig;

export function Temperature() {
  const [Data, setData] = React.useState<Wastedata[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://metrominds.onrender.com/dashboard-data");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data.waste);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = Data.map((item, index) => ({
    location: `Location ${index + 1}`,
    temperature: item.temperature,
  }));

  const totalTemperature = chartData.reduce(
    (sum, data) => sum + data.temperature,
    0
  );
  const averageTemperature = (totalTemperature / chartData.length).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Air Temperature (°C) - For 14 Locations</CardTitle>
        <CardDescription>
          Temperature recorded at various locations on {Data[0]?.date || "NA"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              left: 5,
              right: 5,
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
              domain={[25, 35]} // Adjust based on temperature range
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="temperature"
              type="monotone"
              stroke="var(--color-temperature)"
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
              The Average Air Temperature is {averageTemperature}°C
              <TrendingDown className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing Temperature for all 14 locations on{" "}
              {Data[0]?.date || "NA"}.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
