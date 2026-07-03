"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;
    if (password !== confirm) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/login?registered=true");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-30%] right-[-20%] h-[600px] w-[600px] rounded-full bg-purple-600/30 blur-3xl animate-float" />
        <div className="absolute bottom-[-30%] left-[-20%] h-[600px] w-[600px] rounded-full bg-blue-600/30 blur-3xl animate-float [animation-delay:3s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-pink-600/20 blur-3xl" />
      </div>

      <div className="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
        <div className="hidden lg:flex flex-col justify-center space-y-6 p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">NexGen <span className="text-gradient">Affilates</span></span>
          </div>
          <h1 className="text-5xl font-bold leading-tight">Start Your <br /><span className="text-gradient">Journey</span></h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">Get access to advanced geo-routing, real-time analytics, and a powerful link rotator—all designed for affiliate success.</p>
          <ul className="space-y-2 text-gray-300">
            {["Unlimited Links", "Custom Domains", "Geo & Device Targeting"].map(item => (
              <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-400" /><span>{item}</span></li>
            ))}
          </ul>
        </div>

        <Card className="w-full max-w-md mx-auto lg:mx-0 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Create account</CardTitle>
            <CardDescription className="text-gray-400">Start your 14-day free trial. No credit card required.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full name</Label>
                <Input id="name" name="name" placeholder="John Doe" required className="bg-[#0A0A0A]/60 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-[#0A0A0A]/60 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="bg-[#0A0A0A]/60 border-gray-700 text-white pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="••••••••" required className="bg-[#0A0A0A]/60 border-gray-700 text-white pr-10" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-70">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : "Create Account"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="border-t border-white/5 pt-6">
            <p className="text-center text-sm text-gray-400 w-full">Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">Sign in</Link></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}