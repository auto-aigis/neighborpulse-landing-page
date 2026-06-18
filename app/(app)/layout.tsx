"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "../_components/AuthProvider";
import { AppShell } from "../_components/AppShell";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!user.is_verified) {
        router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
      } else if (!user.onboarding_complete && pathname !== "/onboarding") {
        router.push("/onboarding");
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (!user || !user.is_verified) return null;
  if (!user.onboarding_complete && pathname !== "/onboarding") return null;

  return <AppShell>{children}</AppShell>;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
