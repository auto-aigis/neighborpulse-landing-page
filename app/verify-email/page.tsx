"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "../_lib/api";
import { Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">(
    token ? "loading" : "pending"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (token) {
      authApi
        .verifyEmail(token)
        .then(() => {
          setStatus("success");
          setTimeout(() => router.push("/login"), 2000);
        })
        .catch((err) => {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "Verification failed");
        });
    }
  }, [token, router]);

  const handleResend = async () => {
    if (!emailParam) return;
    try {
      await authApi.resendVerification(emailParam);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch {
      setErrorMsg("Failed to resend verification email");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-amber-500 animate-spin" />
            <p className="text-gray-600">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <CardTitle className="mb-2">Email Verified!</CardTitle>
            <CardDescription>Redirecting to login...</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <CardTitle className="mb-2">Verification Failed</CardTitle>
            <CardDescription className="text-red-600">{errorMsg}</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 text-amber-500" />
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a verification link to{" "}
            <span className="font-medium text-gray-900">{emailParam}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Click the link in the email to verify your account.
          </p>
          {resent && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-700">
                Verification email sent!
              </AlertDescription>
            </Alert>
          )}
          <Button variant="outline" className="w-full" onClick={handleResend}>
            Resend verification email
          </Button>
          <p className="text-center text-sm">
            <Link href="/login" className="text-amber-600 hover:underline">
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
