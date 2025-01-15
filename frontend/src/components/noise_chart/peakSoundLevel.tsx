import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

interface Noisedata {
  date: string;
  peakSoundLevel: number;
  latitude: number;
  longitude: number;
  noiseLevel: number;
  durationOfSoundEvents: number;
}

const chartConfig = {
  peakSoundLevel: {
    label: "Peak Sound Level (dB)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PeakSoundLevelChart() {
  const [Data, setData] = React.useState<Noisedata[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://metrominds.onrender.com/dashboard-data");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data.noise); // Assuming the response has a 'noise' field for sound data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = Data.map((item, index) => ({
    location: `Location ${index + 1}`,
    peakSoundLevel: item.peakSoundLevel,
  }));

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>
            Peak Sound Level (dB) - for {Data[0]?.date || "NA"}
          </CardTitle>
          <CardDescription>
            Showing peak sound level data for all regions
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillPeakSoundLevel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-peakSoundLevel)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-peakSoundLevel)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="location"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Location: ${value}`}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="peakSoundLevel"
              type="natural"
              fill="url(#fillPeakSoundLevel)"
              stroke="var(--color-peakSoundLevel)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
