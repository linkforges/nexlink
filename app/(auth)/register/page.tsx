"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: searchParams.get("callbackUrl") ?? "/dashboard" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
      const safeRedirect = callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
      const params = new URLSearchParams({ registered: "true" });
      params.set("callbackUrl", safeRedirect);
      router.push(`/login?${params.toString()}`);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong while creating your account.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.2),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.2),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_55%,_#111827_100%)] px-4 py-8 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-purple-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-semibold tracking-tight">NexGen <span className="text-gradient">Affilates</span></span>
          </div>
          <h1 className="mt-8 text-4xl font-semibold leading-tight sm:text-5xl">Start your <span className="text-gradient">smarter affiliate journey</span>.</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">Create your account and unlock analytics, geo routing, and polished link experiences designed to grow faster.</p>
          <ul className="mt-8 space-y-3 text-slate-200">
            {['Unlimited links', 'Custom domains', 'Geo & device targeting'].map((item) => (
              <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-400" /><span>{item}</span></li>
            ))}
          </ul>
        </div>

        <Card className="mx-auto w-full max-w-md border-white/10 bg-slate-950/70 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-white">Create your account</CardTitle>
            <CardDescription className="text-sm text-slate-400">Start with a free account and unlock your first campaign in minutes.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">Full name</Label>
                <Input id="name" name="name" placeholder="John Doe" required className="border-white/10 bg-slate-900/80 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required className="border-white/10 bg-slate-900/80 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="border-white/10 bg-slate-900/80 pr-10 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">Confirm password</Label>
                <div className="relative">
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="••••••••" required className="border-white/10 bg-slate-900/80 pr-10 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-6 font-semibold text-white transition-all hover:scale-[1.01] hover:from-purple-500 hover:to-pink-500 disabled:opacity-70">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : "Create Account"}
              </Button>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-[0.25em]"><span className="bg-slate-950 px-2 text-slate-500">Or sign up with</span></div>
              </div>
              <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                Continue with Google
              </Button>
            </CardContent>
          </form>
          <CardFooter className="border-t border-white/10 pt-6">
            <p className="w-full text-center text-sm text-slate-400">Already have an account? <Link href="/login" className="font-semibold text-blue-400 transition hover:text-blue-300">Sign in</Link></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}