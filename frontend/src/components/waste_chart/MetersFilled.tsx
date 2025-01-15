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
  metersFilled: {
    label: "Meters Filled (m)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MetersFilled() {
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

  const chartData = Data.map((item,index) => ({
    location: `Location ${index + 1}`,
    metersFilled: item.metersFilled,
  }));

  const totalMetersFilled = chartData.reduce(
    (sum, data) => sum + data.metersFilled,
    0
  );
  const averageMetersFilled = (totalMetersFilled / chartData.length).toFixed(1);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Meters Filled (m) - for 14 locations</CardTitle>
        <CardDescription>
          Meters filled recorded at various locations on {Data[0]?.date || "NA"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              right: 10,
              left:30
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
              domain={[0, Math.max(...chartData.map((d) => d.metersFilled)) + 5]} // Adjust dynamically
              tickCount={6}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="metersFilled"
              fill="var(--color-metersFilled)"
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
                dataKey="metersFilled"
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
          The Average Meters Filled is {averageMetersFilled}m
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
        Showing Meters filled for all 14 locations on {Data[0]?.date || "NA"}
        </div>
      </CardFooter>
    </Card>
  );
}
