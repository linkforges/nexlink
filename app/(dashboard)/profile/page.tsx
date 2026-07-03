"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => { setUser(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <Card className="bg-[#1A1A1A] border-gray-800">
        <CardHeader><CardTitle className="text-white">Account Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-white/10">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Full Name</Label>
            <Input defaultValue={user?.name} className="bg-[#0A0A0A] border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Email</Label>
            <Input defaultValue={user?.email} className="bg-[#0A0A0A] border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Gmail (Contact)</Label>
            <Input defaultValue={user?.gmail} className="bg-[#0A0A0A] border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Address</Label>
            <Input defaultValue={user?.address} className="bg-[#0A0A0A] border-gray-700 text-white" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}