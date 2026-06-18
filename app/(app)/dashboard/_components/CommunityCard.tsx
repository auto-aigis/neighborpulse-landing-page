"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import type { Community } from "../../../_lib/types";

interface CommunityCardProps {
  community: Community;
  onJoin: (id: string) => void;
  joining: string | null;
}

export function CommunityCard({ community, onJoin, joining }: CommunityCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{community.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{community.description}</p>
          </div>
          <Badge variant="outline" className="ml-2">
            <Users className="w-3 h-3 mr-1" />
            {community.size_min}-{community.size_max}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{community.theme}</Badge>
          <Button
            size="sm"
            onClick={() => onJoin(community.id)}
            disabled={community.is_joined || joining === community.id}
          >
            {community.is_joined ? "Joined" : joining === community.id ? "Joining..." : "Join"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
