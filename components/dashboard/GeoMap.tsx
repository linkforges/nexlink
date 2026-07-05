"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface GeoMapProps {
  data: { country: string; clicks: number }[];
}

export function GeoMap({ data }: GeoMapProps) {
  const sorted = [...data].sort((a, b) => b.clicks - a.clicks).slice(0, 10);
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={sorted} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" horizontal={false} />
        <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis dataKey="country" type="category" stroke="#94a3b8" fontSize={12} width={60} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", color: "#f8fafc" }} />
        <Bar dataKey="clicks" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}