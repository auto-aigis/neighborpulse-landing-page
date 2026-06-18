"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { paymentsApi, authApi } from "../../_lib/api";
import { useAuth } from "../../_components/AuthProvider";
import { Check, Zap, Crown, Star, Lock } from "lucide-react";

const TIERS = [
  {
    id: "explorer",
    name: "Explorer",
    description: "For the curious newcomer",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Weekly digest of 3 curated events",
      "Basic interest profile",
      "Email delivery",
    ],
  },
  {
    id: "social_scout",
    name: "Social Scout",
    description: "For the explorer who wants to stay ahead",
    monthlyPrice: 4.99,
    yearlyPrice: 39.99,
    features: [
      "Everything in Explorer",
      "5 events per digest (vs. 3)",
      "Early access to events (48hr lead)",
      "Advanced filters (mood, group size, vibe)",
      "Save favorite events",
    ],
  },
  {
    id: "community_connector",
    name: "Community Connector",
    description: "For the connector who's serious about building community",
    monthlyPrice: 7.99,
    yearlyPrice: 69.99,
    features: [
      "Everything in Social Scout",
      "Micro-community matching",
      "Outcome tracking dashboard",
      "Priority support",
    ],
  },
];

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();
  const [annual, setAnnual] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [paddleReady, setPaddleReady] = useState(false);

  useEffect(() => {
    initPaddle();
  }, []);

  const initPaddle = async () => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
      console.warn("Paddle client token not configured");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      const paddle = (window as any).Paddle;
      if (paddle) {
        paddle.Environment.set(process.env.NODE_ENV === "production" ? "production" : "sandbox");
        paddle.Initialize({
          token,
          eventCallback: (event: Record<string, unknown>) => {
            if ((event as { name?: string }).name === "checkout.completed") {
              const data = event as { data?: { transaction_id?: string } };
              const txnId = data?.data?.transaction_id || "";
              window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;
            }
          },
        });
        setPaddleReady(true);
      }
    };
    document.head.appendChild(script);
  };

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (tierId === "explorer") return;

    setLoading(tierId);
    setError("");

    try {
      const billingInterval = annual ? "yearly" : "monthly";
      const res = await paymentsApi.checkout(tierId as "social_scout" | "community_connector", billingInterval);

      const paddle = (window as any).Paddle;
      if (paddle && paddleReady) {
        paddle.Checkout.open({
          items: [{ priceId: res.price_id, quantity: 1 }],
          customData: { user_id: user.id },
          settings: { displayMode: "overlay" },
        });
      } else {
        setError("Payment system not ready. Please refresh and try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(null);
    }
  };

  const saveAmount = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    const annualCost = yearly;
    const monthlyCost = monthly * 12;
    return Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Upgrade your experience</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Choose the plan that fits your social goals. Upgrade anytime.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Label htmlFor="annual-toggle" className={annual ? "text-gray-900" : "text-gray-500"}>
          Monthly
        </Label>
        <Switch
          id="annual-toggle"
          checked={annual}
          onCheckedChange={setAnnual}
        />
        <Label htmlFor="annual-toggle" className={annual ? "text-gray-900" : "text-gray-500"}>
          Annual
        </Label>
        {annual && (
          <Badge className="bg-green-100 text-green-700 ml-2">Save 33%</Badge>
        )}
      </div>

      {error && (
        <div className="max-w-md mx-auto p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {TIERS.map((tier) => {
          const isCurrentPlan = user?.tier === tier.id;
          const price = annual ? tier.yearlyPrice : tier.monthlyPrice;
          const isFree = price === 0;
          const isPopular = tier.id === "social_scout";

          return (
            <Card
              key={tier.id}
              className={`relative ${isPopular ? "border-amber-500 border-2" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-amber-500 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  {isFree ? (
                    <span className="text-4xl font-bold text-gray-900">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">${price.toFixed(2)}</span>
                      <span className="text-gray-600">/{annual ? "year" : "month"}</span>
                    </>
                  )}
                </div>
                <ul className="space-y-3 text-left">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : tier.id === "explorer" ? "outline" : "default"}
                  disabled={isCurrentPlan || loading === tier.id}
                  onClick={() => handleSubscribe(tier.id)}
                >
                  {isCurrentPlan ? (
                    "Current Plan"
                  ) : loading === tier.id ? (
                    "Processing..."
                  ) : tier.id === "explorer" ? (
                    "Get Started"
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
      <PricingContent />
    </Suspense>
  );
}
