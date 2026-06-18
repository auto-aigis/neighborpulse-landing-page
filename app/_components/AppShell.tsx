"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Menu, X, Home, User, CreditCard, Settings, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/pricing", label: "Billing", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">NeighborPulse</h1>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
        {user.tier === "community_connector" && (
          <Link
            href="/dashboard/communities"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard/communities"
                ? "bg-gray-100 font-medium text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users className="w-5 h-5" />
            Communities
          </Link>
        )}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
        <span className="mx-auto text-lg font-semibold text-gray-900">NeighborPulse</span>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 bg-white border-r border-gray-200">
        <NavContent />
      </aside>

      {/* Main content */}
      <main className="md:ml-64 pt-14 md:pt-0 min-h-screen">
        <div className="max-w-5xl mx-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
