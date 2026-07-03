"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ClickLog {
  id: string;
  createdAt: string;
  country: string;
  device: string;
  browser: string;
  os: string;
  referrer: string;
  visitorHash: string;
  ip: string;
}

export default function ClickLogsPage() {
  const params = useParams();
  const linkId = params.id as string;
  const [logs, setLogs] = useState<ClickLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ country: "", device: "" });
  const pageSize = 20;

  const fetchLogs = async () => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
      country: filters.country,
      device: filters.device,
    });
    const res = await fetch(`/api/links/${linkId}/clicks?${query}`);
    const data = await res.json();
    setLogs(data.logs);
    setTotal(data.total);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, [page, filters, linkId]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Click Logs</h1>
      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardHeader><CardTitle className="text-white">Filters</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Input
            placeholder="Country (US, GB, ...)"
            value={filters.country}
            onChange={e => setFilters({...filters, country: e.target.value})}
            className="w-40 bg-[#0A0A0A] border-gray-700 text-white"
          />
          <Input
            placeholder="Device"
            value={filters.device}
            onChange={e => setFilters({...filters, device: e.target.value})}
            className="w-40 bg-[#0A0A0A] border-gray-700 text-white"
          />
          <Button variant="outline" onClick={() => { setFilters({ country: "", device: "" }); setPage(1); }}>Clear</Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">Time</TableHead>
                <TableHead className="text-gray-400">IP</TableHead>
                <TableHead className="text-gray-400">Country</TableHead>
                <TableHead className="text-gray-400">Device</TableHead>
                <TableHead className="text-gray-400">Browser</TableHead>
                <TableHead className="text-gray-400">Referrer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id} className="border-gray-800/50">
                  <TableCell className="text-white text-sm">{new Date(log.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-xs">{log.ip || "—"}</TableCell>
                  <TableCell>{log.country || "—"}</TableCell>
                  <TableCell>{log.device || "—"}</TableCell>
                  <TableCell>{log.browser || "—"}</TableCell>
                  <TableCell className="truncate max-w-xs">{log.referrer || "direct"}</TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-gray-400">No clicks found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between p-4 border-t border-gray-800">
            <span className="text-sm text-gray-400">Total: {total}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p+1)} disabled={page * pageSize >= total}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}