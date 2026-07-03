"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";

export default function EditLinkPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    destinationUrl: "",
    domain: "default",
    slug: "",
    rotatorMode: "turbo",
    note: "",
  });

  useEffect(() => {
    fetch(`/api/links/${params.id}`)
      .then(res => res.json())
      .then(data => setForm(data))
      .catch(() => toast({ description: "Failed to load link", variant: "destructive" }));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/links/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast({ description: "Link updated successfully!" });
      router.push("/links");
    } else {
      const data = await res.json();
      toast({ description: data.error || "Failed to update link", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Link</h1>
      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardHeader><CardTitle className="text-white">Link Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Link Name</Label>
              <Input id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="bg-[#0A0A0A] border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination URL (Fallback)</Label>
              <Input id="destination" value={form.destinationUrl} onChange={e => setForm({...form, destinationUrl: e.target.value})} required className="bg-[#0A0A0A] border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label>Rotator Mode</Label>
              <ToggleGroup type="single" value={form.rotatorMode} onValueChange={(val) => val && setForm({...form, rotatorMode: val})} className="justify-start gap-2">
                <ToggleGroupItem value="turbo" className="data-[state=on]:bg-blue-600 data-[state=on]:text-white bg-[#0A0A0A] border-gray-700 text-white">
                  ⚡ Turbo (1:1)
                </ToggleGroupItem>
                <ToggleGroupItem value="slow" className="data-[state=on]:bg-purple-600 data-[state=on]:text-white bg-[#0A0A0A] border-gray-700 text-white">
                  🐢 Slow (USA 3:1)
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="space-y-2">
              <Label>Domain</Label>
              <Input value={form.domain} onChange={e => setForm({...form, domain: e.target.value})} className="bg-[#0A0A0A] border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="bg-[#0A0A0A] border-gray-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="bg-[#0A0A0A] border-gray-700 text-white" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? "Updating..." : "Update Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}