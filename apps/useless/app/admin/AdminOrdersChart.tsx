"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@ggprompts/ui";

// Mock data for the chart - showing orders over time
// In a real app, you'd fetch this from the database
const chartData = [
  { month: "Jan", orders: 12, revenue: 1240 },
  { month: "Feb", orders: 19, revenue: 2100 },
  { month: "Mar", orders: 8, revenue: 890 },
  { month: "Apr", orders: 24, revenue: 3200 },
  { month: "May", orders: 31, revenue: 4100 },
  { month: "Jun", orders: 18, revenue: 2400 },
  { month: "Jul", orders: 42, revenue: 5600 },
  { month: "Aug", orders: 35, revenue: 4800 },
  { month: "Sep", orders: 28, revenue: 3900 },
  { month: "Oct", orders: 45, revenue: 6200 },
  { month: "Nov", orders: 52, revenue: 7100 },
  { month: "Dec", orders: 38, revenue: 5200 },
];

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(var(--primary))",
  },
  revenue: {
    label: "Fake Revenue",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;

export function AdminOrdersChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
          top: 12,
          bottom: 12,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <defs>
          <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-orders)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-orders)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="orders"
          type="monotone"
          fill="url(#fillOrders)"
          fillOpacity={0.4}
          stroke="var(--color-orders)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
