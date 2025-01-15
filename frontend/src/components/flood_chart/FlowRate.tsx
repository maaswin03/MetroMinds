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
  flowRate: {
    label: "flowRate:",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function FlowRate() {
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
    flowRate: item.flowRate,
  }));

  const totalflowRate = chartData?.reduce((sum, data) => sum + data.flowRate, 0);
  const averageflowRate = (totalflowRate / chartData.length).toFixed(1);

  const startDate = chartData[0]?.date || "N/A";
  const endDate = chartData[chartData.length - 1]?.date || "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flow Rate (m³/s) - Last 7 Days</CardTitle>
        <CardDescription>
          Flow rate for each day from {endDate} to {startDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="date"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis
              dataKey="flowRate"
              type="number"
              domain={[0, Math.max(...chartData.map((d) => d.flowRate)) + 5]} // Adjust dynamically
              tickCount={6}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="flowRate"
              layout="vertical"
              fill="var(--color-flowRate)"
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
                dataKey="flowRate"
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
          The Average flow rate is {averageflowRate}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Data represents the flow rate from {endDate} to {startDate}.
        </div>
      </CardFooter>
    </Card>
  );
}
