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
  strain: {
    label: "Strain",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Strain() {
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
    strain: item.strain, 
  }));

  const totalStrain = chartData?.reduce((sum, data) => sum + data.strain, 0);
  const averageStrain = (totalStrain / chartData.length).toFixed(4); // Adjust to 4 decimal places

  const startDate = chartData[0]?.date || "N/A";
  const endDate = chartData[chartData.length - 1]?.date || "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strain - Last 7 Days</CardTitle>
        <CardDescription>
          Strain for each day from {endDate} to {startDate}
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
              dataKey="strain"
              type="number"
              domain={[0, Math.max(...chartData.map((d) => d.strain)) + 0.001]} // Adjust dynamically
              tickCount={6}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="strain"
              layout="vertical"
              fill="var(--color-strain)"
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
                dataKey="strain"
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
          The Average strain is {averageStrain}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Data represents the strain from {endDate} to {startDate}.
        </div>
      </CardFooter>
    </Card>
  );
}
