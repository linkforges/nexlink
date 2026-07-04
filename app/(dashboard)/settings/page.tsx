"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Offer {
  url: string;
  weight: number;
}

interface CountryConfig {
  offers: Offer[];
  returning_behavior?: {
    enabled: boolean;
    mode?: "second_offer" | "round_robin";
  };
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [countryOffers, setCountryOffers] = useState<Record<string, CountryConfig>>({});
  const [newCountry, setNewCountry] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.countryOffers) setCountryOffers(data.countryOffers);
        setLoading(false);
      });
  }, []);

  const addCountry = () => {
    if (!newCountry) return;
    setCountryOffers(prev => ({
      ...prev,
      [newCountry.toUpperCase()]: { offers: [{ url: "", weight: 100 }] },
    }));
    setNewCountry("");
  };

  const addOffer = (country: string) => {
    setCountryOffers(prev => ({
      ...prev,
      [country]: {
        ...prev[country],
        offers: [...prev[country].offers, { url: "", weight: 0 }],
      },
    }));
  };

  const updateOffer = (country: string, index: number, field: keyof Offer, value: string | number) => {
    setCountryOffers(prev => {
      const config = prev[country];
      if (!config) return prev;

      return {
        ...prev,
        [country]: {
          ...config,
          offers: config.offers.map((offer, idx) =>
            idx === index
              ? field === "weight"
                ? { ...offer, weight: Number(value) }
                : { ...offer, url: String(value) }
              : offer,
          ),
        },
      };
    });
  };

  const removeOffer = (country: string, index: number) => {
    setCountryOffers(prev => {
      const updated = { ...prev };
      updated[country].offers.splice(index, 1);
      if (updated[country].offers.length === 0) delete updated[country];
      return updated;
    });
  };

  const removeCountry = (country: string) => {
    setCountryOffers(prev => {
      const updated = { ...prev };
      delete updated[country];
      return updated;
    });
  };

  const saveSettings = async () => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryOffers }),
    });
    if (res.ok) {
      toast({ description: "Settings saved successfully" });
    } else {
      toast({ description: "Failed to save settings", variant: "destructive" });
    }
  };

  if (loading) return <div className="text-gray-400">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">⚙️ Settings</h1>
        <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <Tabs defaultValue="offers" className="space-y-4">
        <TabsList className="bg-[#1A1A1A] border-gray-800">
          <TabsTrigger value="offers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Geo Offers & Rotator</TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">General</TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="space-y-4">
          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">🌍 Country Offers</CardTitle>
              <p className="text-sm text-gray-400">
                Visitors matching these countries will be redirected to the specified offer URLs.
                Others fallback to the link's Destination URL.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(countryOffers).map(([country, config]) => (
                <div key={country} className="border border-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇺🇸</span>
                      <span className="font-mono font-bold text-white">{country}</span>
                      <Badge variant="outline" className="border-gray-700 text-gray-300">
                        {config.offers.length} Offers
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-500" onClick={() => removeCountry(country)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 hover:bg-transparent">
                        <TableHead className="text-gray-400 w-[100px]">Priority %</TableHead>
                        <TableHead className="text-gray-400">Offer URL</TableHead>
                        <TableHead className="text-gray-400 w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {config.offers.map((offer, idx) => (
                        <TableRow key={idx} className="border-gray-800/50 hover:bg-white/5">
                          <TableCell>
                            <Input
                              type="number"
                              value={offer.weight}
                              onChange={e => updateOffer(country, idx, "weight", parseInt(e.target.value) || 0)}
                              className="w-20 bg-[#0A0A0A] border-gray-700 text-white"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={offer.url}
                              onChange={e => updateOffer(country, idx, "url", e.target.value)}
                              placeholder="https://example.com/offer?sub1="
                              className="bg-[#0A0A0A] border-gray-700 text-white font-mono text-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10" onClick={() => removeOffer(country, idx)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-white/5" onClick={() => addOffer(country)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Offer
                  </Button>

                  {/* Returning Visitor Configuration */}
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={config.returning_behavior?.enabled || false}
                          onCheckedChange={(checked) => {
                            const nextConfig: CountryConfig = {
                              ...config,
                              returning_behavior: {
                                enabled: checked,
                                mode: config.returning_behavior?.mode ?? "second_offer",
                              },
                            };

                            setCountryOffers(prev => ({
                              ...prev,
                              [country]: nextConfig,
                            }));
                          }}
                        />
                        <span className="text-sm text-gray-300">Enable Returning Visitor Rotation</span>
                      </div>
                    </div>
                    {config.returning_behavior?.enabled && (
                      <RadioGroup
                        value={config.returning_behavior?.mode}
                        onValueChange={(val) => {
                          const nextConfig: CountryConfig = {
                            offers: config.offers,
                            returning_behavior: {
                              enabled: config.returning_behavior?.enabled ?? false,
                              mode: val as "second_offer" | "round_robin",
                            },
                          };

                          setCountryOffers(prev => ({
                            ...prev,
                            [country]: nextConfig,
                          }));
                        }}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="second_offer" id="second" />
                          <Label htmlFor="second" className="text-sm text-gray-300">Second Offer Only</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="round_robin" id="round" />
                          <Label htmlFor="round" className="text-sm text-gray-300">Round Robin (Skip Primary)</Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <Input
                  placeholder="Add new country (e.g., US)"
                  value={newCountry}
                  onChange={e => setNewCountry(e.target.value)}
                  className="max-w-xs bg-[#0A0A0A] border-gray-700 text-white"
                />
                <Button onClick={addCountry} variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/5">
                  <Plus className="h-4 w-4 mr-2" /> Add Country
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card className="bg-[#1A1A1A] border-gray-800">
            <CardHeader><CardTitle className="text-white">General Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Default Destination URL</Label>
                <Input placeholder="https://default.com" className="bg-[#0A0A0A] border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Default Note</Label>
                <Input placeholder="Optional note..." className="bg-[#0A0A0A] border-gray-700 text-white" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}