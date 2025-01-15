import { TrendingUp } from "lucide-react";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
  noiseLevel: {
    label: "Noise Level (dB)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function NoiseLevelChart() {
  const [Data, setData] = React.useState<Noisedata[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://metrominds.onrender.com/dashboard-data");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data.noise); // Assuming the response has a 'noise' field
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = Data.map((item, index) => ({
    location: `Location ${index + 1}`,
    noiseLevel: item.noiseLevel,
  }));

  const totalNoiseLevel = chartData.reduce(
    (sum, data) => sum + data.noiseLevel,
    0
  );
  const averageNoiseLevel = (totalNoiseLevel / chartData.length).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Noise Level (dB) - Last 7 Days</CardTitle>
        <CardDescription>
          Noise level recorded at various locations on {Data[0]?.date || "NA"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              right: 10,
              left: 25,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="location"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis
              type="number"
              domain={[60, Math.max(...chartData.map((d) => d.noiseLevel)) + 5]} // Adjust dynamically
              tickCount={6}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="noiseLevel"
              fill="var(--color-noiseLevel)"
              radius={4}
            >
              <LabelList
                dataKey="date"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="noiseLevel"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          The Average Noise Level is {averageNoiseLevel} dB
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing Noise Level data for all locations on {Data[0]?.date || "NA"}
        </div>
      </CardFooter>
    </Card>
  );
}
