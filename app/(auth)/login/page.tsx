"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-30%] left-[-20%] h-[600px] w-[600px] rounded-full bg-blue-600/30 blur-3xl animate-float" />
        <div className="absolute bottom-[-30%] right-[-20%] h-[600px] w-[600px] rounded-full bg-purple-600/30 blur-3xl animate-float [animation-delay:3s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-pink-600/20 blur-3xl" />
      </div>

      <div className="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
        <div className="hidden lg:flex flex-col justify-center space-y-6 p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">
              NexGen <span className="text-gradient">Affilates</span>
            </span>
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Smart Link <br />
            <span className="text-gradient">Geo-Control</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            The ultimate tracking platform for affiliate marketers. Real-time throttling, weighted rotators, and enterprise-grade analytics.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {["#1", "#2", "#3"].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xs font-bold text-white">
                  {i}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500">Join 2,000+ affiliates</span>
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto lg:mx-0 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
            <CardDescription className="text-gray-400">Sign in to your NexGen Affilates account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-[#0A0A0A]/60 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">Forgot?</Link>
                </div>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="bg-[#0A0A0A]/60 border-gray-700 text-white pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-70">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-4 border-t border-white/5 pt-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0A0A0A] px-2 text-gray-500">Or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" onClick={() => signIn("google")} className="bg-[#0A0A0A]/60 border-gray-700 text-white hover:bg-gray-800">Google</Button>
              <Button variant="outline" className="bg-[#0A0A0A]/60 border-gray-700 text-white hover:bg-gray-800">GitHub</Button>
            </div>
            <p className="text-center text-sm text-gray-400">
              Don't have an account? <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold">Sign up</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}