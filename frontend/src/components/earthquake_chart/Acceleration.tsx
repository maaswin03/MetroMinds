import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  accelerationX: {
    label: "Acceleration X",
    color: "hsl(var(--chart-1))",
  },
  accelerationY: {
    label: "Acceleration Y",
    color: "hsl(var(--chart-2))",
  },
  accelerationZ: {
    label: "Acceleration Z",
    color: "hsl(340, 70%, 50%)",
  },
} satisfies ChartConfig;

export function Acceleration() {
  const [timeRange, setTimeRange] = React.useState("30");
  const [Data, setData] = React.useState<earthquakeData[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://metrominds.onrender.com/dashboard-data");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        console.log(data.earthquake);

        setData(data.earthquake);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = Data.map((item) => ({
    date: new Date(item.date),
    formattedDate: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    accelerationX: item.acceleration.x,
    accelerationY: item.acceleration.y,
    accelerationZ: item.acceleration.z,
  }));

  const filteredData = chartData.filter((item) => {
    const referenceDate = new Date();
    let daysToSubtract = 30;

    if (timeRange === "15") {
      daysToSubtract = 15;
    } else if (timeRange === "7") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return item.date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>
            Acceleration (m/s²) - <span>Last {timeRange} Days</span>
          </CardTitle>
          <CardDescription>
            Showing acceleration data (X, Y, Z) for the selected time range
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="15" className="rounded-lg">
              Last 15 days
            </SelectItem>
            <SelectItem value="7" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient
                id="fillAccelerationX"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-accelerationX)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-accelerationX)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillAccelerationY"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-accelerationY)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-accelerationY)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillAccelerationZ"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-accelerationZ)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-accelerationZ)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="formattedDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="accelerationX"
              type="monotone"
              fill="url(#fillAccelerationX)"
              stroke="var(--color-accelerationX)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              dataKey="accelerationY"
              type="monotone"
              fill="url(#fillAccelerationY)"
              stroke="var(--color-accelerationY)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              dataKey="accelerationZ"
              type="monotone"
              fill="url(#fillAccelerationZ)"
              stroke="var(--color-accelerationZ)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
