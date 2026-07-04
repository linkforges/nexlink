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
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">Campaign library</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">All Links</h1>
          <p className="mt-2 text-sm text-slate-400">Manage, analyze, and grow every offer with a unified workspace.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/links/import">
            <Button variant="outline" className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10">
              Import CSV
            </Button>
          </Link>
          <Link href="/links/create">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
              <Plus className="mr-2 h-4 w-4" /> Create Link
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4 shadow-lg shadow-black/20 backdrop-blur-xl">
        <Input
          placeholder="Search links..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm border-white/10 bg-slate-900/70 text-white placeholder:text-slate-500"
        />
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <Card className="border-white/10 bg-slate-950/60 py-12 text-center shadow-lg shadow-black/20 backdrop-blur-xl">
            <p className="text-slate-400">No links yet. Create your first one!</p>
          </Card>
        )}
        {filtered.map((link) => (
          <Card key={link.id} className="border-white/10 bg-slate-950/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400/30 hover:shadow-[0_18px_60px_rgba(59,130,246,0.12)]">
            <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
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
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <span>https://{link.domain}/{link.slug}</span>
                  <button onClick={() => copyToClipboard(`https://${link.domain}/${link.slug}`)} className="transition hover:text-white">
                    <Copy className="h-3 w-3" />
                  </button>
                  <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-300">{link.totalClicksCache} clicks</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
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