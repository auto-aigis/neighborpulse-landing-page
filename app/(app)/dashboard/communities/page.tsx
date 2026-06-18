"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { communitiesApi } from "../../../_lib/api";
import { useAuth } from "../../../_components/AuthProvider";
import type { Community } from "../../../_lib/types";
import { CommunityCard } from "../_components/CommunityCard";
import { Lock, Crown } from "lucide-react";
import Link from "next/link";

export default function CommunitiesPage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    if (user?.tier === "community_connector") {
      loadCommunities();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCommunities = async () => {
    try {
      const data = await communitiesApi.list();
      setCommunities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (communityId: string) => {
    setJoining(communityId);
    try {
      await communitiesApi.join(communityId);
      await loadCommunities();
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(null);
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
          <h1 className="text-2xl font-semibold text-gray-900">Communities</h1>
          <p className="text-gray-600">Join small groups around shared interests</p>
        </div>
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="py-12 text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Upgrade to Community Connector
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get matched with small groups of 4-8 people around recurring local themes. 
              Make meaningful connections in your new city.
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

  const userCity = "";
  const filteredCommunities = communities.filter(
    (c) => !userCity || c.city === userCity
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Communities</h1>
        <p className="text-gray-600">Join small groups around shared interests</p>
      </div>

      {filteredCommunities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            No communities available in your city yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCommunities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={handleJoin}
              joining={joining}
            />
          ))}
        </div>
      )}
    </div>
  );
}
