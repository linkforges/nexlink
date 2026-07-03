"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Copy, ExternalLink, RotateCcw, Edit, Trash2, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface LinkItem {
  id: string;
  name: string;
  slug: string;
  domain: string;
  rotatorMode: string;
  totalClicksCache: number;
  publicToken: string;
  slowAccumulator: number;
}

export default function LinksPage() {
  const { toast } = useToast();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => { fetchLinks(); }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Copied!" });
  };

  const resetLink = async (id: string) => {
    if (!confirm("Reset all analytics for this link?")) return;
    await fetch(`/api/links/${id}/reset`, { method: "POST" });
    toast({ description: "Link reset successfully" });
    fetchLinks();
  };

  const deleteLink = async (id: string) => {
    if (!confirm("Delete this link?")) return;
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    toast({ description: "Link deleted" });
    fetchLinks();
  };

  const filtered = links.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold tracking-tight">All Links</h1>
        <div className="flex gap-2">
          <Link href="/links/import">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/5">
              Import CSV
            </Button>
          </Link>
          <Link href="/links/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Create Link
            </Button>
          </Link>
        </div>
      </div>

      <Input
        placeholder="Search links..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm bg-[#1A1A1A] border-gray-800 text-white placeholder:text-gray-500"
      />

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <Card className="bg-[#1A1A1A] border-gray-800 text-center py-12">
            <p className="text-gray-400">No links yet. Create your first one!</p>
          </Card>
        )}
        {filtered.map((link) => (
          <Card key={link.id} className="bg-[#1A1A1A] border-gray-800 hover:border-gray-700 transition-all">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">{link.name}</span>
                  <Badge variant={link.rotatorMode === "turbo" ? "default" : "secondary"}>
                    {link.rotatorMode === "turbo" ? "⚡ Turbo" : "🐢 Slow"}
                  </Badge>
                  {link.rotatorMode === "slow" && link.slowAccumulator > 0 && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                      {link.slowAccumulator} pending
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                  <span>https://{link.domain}/{link.slug}</span>
                  <button onClick={() => copyToClipboard(`https://${link.domain}/${link.slug}`)} className="hover:text-white">
                    <Copy className="h-3 w-3" />
                  </button>
                  <span className="text-xs bg-gray-800 px-2 py-0.5 rounded">{link.totalClicksCache} clicks</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/links/${link.id}/analytics`}>
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    <BarChart className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => window.open(`/public/${link.publicToken}`, "_blank")}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => resetLink(link.id)}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Link href={`/links/edit/${link.id}`}>
                  <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => deleteLink(link.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}