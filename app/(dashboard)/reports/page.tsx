"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";

interface ReportData {
  linkName: string;
  country: string;
  uniqueClicks: number;
  throttledClicks: number;
}

export default function ReportsPage() {
  const { toast } = useToast();
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading report...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Weekly Report</h1>
        <Button variant="outline" className="border-gray-700 text-gray-300">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Country-Wise Clicks (Last 7 Days)</CardTitle>
          <p className="text-sm text-gray-400">
            Unique clicks per country. Slow mode USA clicks are throttled (1 per 3 unique).
          </p>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">Link Name</TableHead>
                <TableHead className="text-gray-400">Country</TableHead>
                <TableHead className="text-gray-400">Unique Clicks</TableHead>
                <TableHead className="text-gray-400">Throttled Clicks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx} className="border-gray-800/50">
                  <TableCell className="text-white">{row.linkName}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.uniqueClicks}</TableCell>
                  <TableCell>{row.throttledClicks}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-gray-400">No data for this week</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}