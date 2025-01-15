import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis} from "recharts";

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
  totalWeight: {
    label: "Total Weight (kg)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Weight() {
  const [Data, setData] = React.useState<Wastedata[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = Data.map((item, index) => ({
    location: `Location ${index + 1}`,
    totalWeight: item.totalWeight,
  }));

  if (loading) {
    return (
      <Card>
        <CardContent>Loading data...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-red-500">{error}</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Total Weight (kg) - for {Data[0]?.date || "NA"}</CardTitle>
          <CardDescription>
            Showing total weight data for all regions
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
              <linearGradient
                id="filltotalWeight"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-totalWeight)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalWeight)"
                  stopOpacity={0.1}
                />
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
              dataKey="totalWeight"
              type="natural"
              fill="url(#filltotalWeight)"
              stroke="var(--color-totalWeight)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
