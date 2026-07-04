"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ClickTrendChartProps {
  data: { date: string; clicks: number }[];
}

export function ClickTrendChart({ data }: ClickTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", color: "#f8fafc" }} />
        <Line type="monotone" dataKey="clicks" stroke="#60a5fa" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "#818cf8" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}