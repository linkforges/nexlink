"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Account created successfully. Please sign in below.");
    }

    if (searchParams.get("error")) {
      setError("Authentication failed. Please use the built-in admin account.");
    }
  }, [searchParams]);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const safeRedirectTarget = callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: safeRedirectTarget,
    });

    if (result?.error) {
      setError("We couldn't sign you in. Please check your email and password and try again.");
      setIsLoading(false);
    } else {
      router.replace(safeRedirectTarget);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.2),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#0f172a_55%,_#111827_100%)] px-4 py-8 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-semibold tracking-tight">
              NexGen <span className="text-gradient">Affilates</span>
            </span>
          </div>
          <h1 className="mt-8 text-4xl font-semibold leading-tight sm:text-5xl">
            Welcome back to your <span className="text-gradient">growth cockpit</span>.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
            Pick up where you left off with instant access to link control, audience segmentation, and your latest campaign performance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Geo routing</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Real-time analytics</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Secure redirects</span>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md border-white/10 bg-slate-950/70 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-white">Access your workspace</CardTitle>
            <CardDescription className="text-sm text-slate-400">Use the preconfigured admin account to continue managing your affiliate links.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {successMessage && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required className="border-white/10 bg-slate-900/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-200">Password</Label>
                  <Link href="#" className="text-sm text-blue-400 transition hover:text-blue-300">Forgot?</Link>
                </div>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="border-white/10 bg-slate-900/80 pr-10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-6 font-semibold text-white transition-all hover:scale-[1.01] hover:from-blue-500 hover:to-purple-500 disabled:opacity-70">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="border-t border-white/10 pt-6">
            <p className="text-center text-sm text-slate-400">
              This workspace uses a single built-in administrator account.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}