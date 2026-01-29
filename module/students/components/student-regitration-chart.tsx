"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { useUsersStore } from "../store/use-student-store";

const chartConfig = {
  students: {
    label: "Students Registered",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StudentRegistrationChart() {
  const users = useUsersStore((state) => state.users);

  // ✅ Date-wise aggregation + sorting
  const chartData = useMemo(() => {
    const map = new Map<string, number>();

    users.forEach((user) => {
      if (user.role !== "STUDENT") return;

      const dateKey = user.createdAt
        .toString()
        .split("T")[0];

      map.set(dateKey, (map.get(dateKey) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([date, students]) => ({ date, students }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [users]);

  // ✅ Peak day
  const highestDay = useMemo(() => {
    if (!chartData.length) return null;
    return chartData.reduce(
      (max, curr) => (curr.students > max.students ? curr : max),
      chartData[0]
    );
  }, [chartData]);

  return (
    <Card className="w-full h-32 px-3 py-0 bg-transparent border border-emerald-900/40">
      <CardContent className="p-0 h-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })
                }
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />

              <Area
                type="monotone"
                dataKey="students"
                fill="var(--color-students)"
                stroke="var(--color-students)"
                fillOpacity={0.35}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      {highestDay && (
        <CardFooter className="p-0 pt-1">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>
              Peak <b>{highestDay.students}</b> on{" "}
              {new Date(highestDay.date).toLocaleDateString("en-IN")}
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
