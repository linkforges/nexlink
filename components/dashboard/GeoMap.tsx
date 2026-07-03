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
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis type="number" stroke="#888" fontSize={12} />
        <YAxis dataKey="country" type="category" stroke="#888" fontSize={12} width={50} />
        <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #333", borderRadius: "8px" }} />
        <Bar dataKey="clicks" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}