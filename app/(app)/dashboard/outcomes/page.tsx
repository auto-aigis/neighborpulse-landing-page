"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { outcomesApi } from "../../../_lib/api";
import { useAuth } from "../../../_components/AuthProvider";
import type { Outcomes } from "../../../_lib/types";
import { Crown, Lock, TrendingUp, Users, Calendar, Zap } from "lucide-react";

export default function OutcomesPage() {
  const { user } = useAuth();
  const [outcomes, setOutcomes] = useState<Outcomes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.tier === "community_connector") {
      loadOutcomes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOutcomes = async () => {
    try {
      const data = await outcomesApi.get();
      setOutcomes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (user?.tier !== "community_connector") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Outcome Tracking</h1>
          <p className="text-gray-600">Track your community building progress</p>
        </div>
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="py-12 text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Upgrade to Community Connector
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Track your events attended, connections made, and activity streak. 
              See your community building progress over time.
            </p>
            <Link href="/pricing">
              <Button className="bg-amber-500 hover:bg-amber-600">
                <Lock className="w-4 h-4 mr-2" />
                Upgrade to Unlock
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Your Outcomes</h1>
        <p className="text-gray-600">Track your community building progress</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events Attended
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {outcomes?.events_attended ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Connections Made
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {outcomes?.connections_made ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Current Streak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {outcomes?.current_streak ?? 0} <span className="text-sm font-normal text-gray-500">weeks</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What this means</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-600">
          <p>
            <strong className="text-gray-900">Events Attended:</strong> Number of events you've marked as "Attended" in your digests.
          </p>
          <p>
            <strong className="text-gray-900">Connections Made:</strong> Times you answered "Yes" or "Maybe" when asked if you made a new connection.
          </p>
          <p>
            <strong className="text-gray-900">Current Streak:</strong> Consecutive weeks with at least one attended event.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
