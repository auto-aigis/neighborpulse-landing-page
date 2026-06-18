"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "../_lib/api";
import { useAuth } from "../_components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setLoading(true);

    try {
      const user = await authApi.login(email, password);
      await refresh();
      if (!user.onboarding_complete) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error && err.message === "email_not_verified") {
        setUnverified(true);
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.resendVerification(email);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch {
      setError("Failed to resend verification email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your NeighborPulse account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {unverified && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription className="text-amber-800">
                  Please verify your email.{" "}
                  <button
                    type="button"
                    className="underline font-medium"
                    onClick={handleResend}
                  >
                    Resend verification
                  </button>
                  {resent && <span className="ml-2 text-green-600">Email sent!</span>}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-amber-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
