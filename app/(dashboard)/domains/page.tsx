"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Domain {
  id: string;
  domain: string;
  verified: boolean;
  verificationToken: string;
}

export default function DomainsPage() {
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDomains = async () => {
    const res = await fetch("/api/domains");
    const data = await res.json();
    setDomains(data);
    setLoading(false);
  };

  useEffect(() => { fetchDomains(); }, []);

  const addDomain = async () => {
    if (!newDomain) return;
    const res = await fetch("/api/domains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: newDomain }),
    });
    if (res.ok) {
      toast({ description: "Domain added. Please verify it." });
      setNewDomain("");
      fetchDomains();
    } else {
      const data = await res.json();
      toast({ description: data.error || "Failed", variant: "destructive" });
    }
  };

  const verifyDomain = async (id: string) => {
    const res = await fetch(`/api/domains/verify/${id}`, { method: "POST" });
    const data = await res.json();
    if (data.verified) {
      toast({ description: "Domain verified!" });
      fetchDomains();
    } else {
      toast({ description: "Verification failed. Check DNS settings.", variant: "destructive" });
    }
  };

  const deleteDomain = async (id: string) => {
    if (!confirm("Delete this domain?")) return;
    await fetch(`/api/domains/${id}`, { method: "DELETE" });
    toast({ description: "Domain deleted" });
    fetchDomains();
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Custom Domains</h1>

      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardHeader><CardTitle className="text-white">Add Domain</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newDomain}
              onChange={e => setNewDomain(e.target.value)}
              placeholder="track.yourdomain.com"
              className="bg-[#0A0A0A] border-gray-700 text-white max-w-md"
            />
            <Button onClick={addDomain} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
          <div className="text-sm text-gray-400 space-y-1">
            <p>To verify your domain, add a TXT record with the following value:</p>
            <code className="block bg-[#0A0A0A] p-2 rounded text-xs text-green-400">
              {domains.length > 0 ? `verification-token: ${domains[0]?.verificationToken || ''}` : 'Add a domain first'}
            </code>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardHeader><CardTitle className="text-white">Your Domains</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">Domain</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map(dom => (
                <TableRow key={dom.id} className="border-gray-800/50">
                  <TableCell className="font-mono text-white">{dom.domain}</TableCell>
                  <TableCell>
                    {dom.verified ? (
                      <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500"><XCircle className="h-3 w-3 mr-1" /> Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!dom.verified && (
                        <Button variant="outline" size="sm" onClick={() => verifyDomain(dom.id)}>
                          <RefreshCw className="h-3 w-3 mr-1" /> Verify
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-400" onClick={() => deleteDomain(dom.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {domains.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-gray-400">No domains added yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}