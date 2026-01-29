"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface ChartData {
  createdAt: string | Date;
  value: number;
}

interface AreaChartCardProps {
  title?: string;
  data: ChartData[];
}

export default function AreaChartCard({
  title = "Student Registrations",
  data,
}: AreaChartCardProps) {
  // 👉 chart friendly data
  const formattedData = data.map((item) => ({
    date: format(new Date(item.createdAt), "dd MMM"),
    value: item.value,
  }));

  const latestValue =
    formattedData[formattedData.length - 1]?.value ?? 0;

  const previousValue =
    formattedData[formattedData.length - 2]?.value ?? 0;

  const growth =
    previousValue > 0
      ? (((latestValue - previousValue) / previousValue) * 100).toFixed(1)
      : "0";

  return (
    <div className="w-full h-full p-5 bg-linear-to-br from-emerald-900 to-emerald-950 rounded-md shadow-xl">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-emerald-200/70">{title}</p>
          <h2 className="text-2xl font-semibold text-white">
            {latestValue} Students
          </h2>
        </div>

        <span
          className={`text-sm font-medium ${
            Number(growth) >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {growth}% ↑
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="70%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff5a00" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#ff5a00" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis hide />

          <Tooltip
            cursor={{ stroke: "#ff5a00", strokeDasharray: "4 4" }}
            contentStyle={{
              background: "#02291f",
              border: "1px solid #065f46",
              borderRadius: "10px",
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#ff5a00"
            strokeWidth={3}
            fill="url(#orangeGradient)"
            dot={false}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}