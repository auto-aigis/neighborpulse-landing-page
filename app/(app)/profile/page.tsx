"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { profileApi } from "../../_lib/api";
import { useAuth } from "../../_components/AuthProvider";
import type { Profile } from "../../_lib/types";
import { Save, MapPin, Crown, Calendar } from "lucide-react";

const CITIES = ["Austin", "Denver", "Atlanta", "NYC", "LA", "SF", "Chicago", "Seattle", "Miami", "DC"];

const GOALS = [
  "Make friends",
  "Find a gym buddy",
  "Explore nightlife",
  "Discover food & restaurants",
  "Find networking events",
  "Find a creative community",
];

const INTERESTS = [
  "Live music",
  "Food & drink",
  "Art & culture",
  "Fitness & outdoors",
  "Tech & startup",
  "Networking",
  "Wellness",
  "Comedy",
  "Film",
  "Books",
];

const FREE_TIME = [
  "Weekday evenings",
  "Saturday daytime",
  "Saturday evening",
  "Sunday daytime",
  "Sunday evening",
];

const VIBE_LABELS = ["Introvert", "Ambivert", "Extrovert"];

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileApi.get();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await profileApi.update(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleArray = (field: "goals" | "interest_tags" | "free_time_slots", value: string) => {
    if (!profile) return;
    setProfile((prev) => {
      if (!prev) return prev;
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Profile not found. Complete onboarding first.</p>
      </div>
    );
  }

  const tierLabel = {
    explorer: "Explorer",
    social_scout: "Social Scout",
    community_connector: "Community Connector",
  }[user?.tier || "explorer"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>
          <p className="text-gray-600">Manage your taste preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" />
          <Badge className="bg-amber-100 text-amber-700">{tierLabel}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location
          </CardTitle>
          <CardDescription>Where are you located?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <select
                className="w-full p-2 border rounded-md bg-white"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              >
                <option value="">Select a city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Neighborhood</Label>
              <Input
                value={profile.neighborhood}
                onChange={(e) => setProfile({ ...profile, neighborhood: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Move Date</Label>
            <Input
              type="date"
              value={profile.move_date}
              onChange={(e) => setProfile({ ...profile, move_date: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>90-Day Goals</CardTitle>
          <CardDescription>What do you want to achieve?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((goal) => (
              <Badge
                key={goal}
                variant={profile.goals.includes(goal) ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${
                  profile.goals.includes(goal) ? "bg-amber-500 hover:bg-amber-600" : ""
                }`}
                onClick={() => toggleArray("goals", goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interests</CardTitle>
          <CardDescription>What are you into?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <Badge
                key={interest}
                variant={profile.interest_tags.includes(interest) ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${
                  profile.interest_tags.includes(interest) ? "bg-amber-500 hover:bg-amber-600" : ""
                }`}
                onClick={() => toggleArray("interest_tags", interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Vibe</CardTitle>
          <CardDescription>How social are you?</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={profile.social_vibe}
            onChange={(e) => setProfile({ ...profile, social_vibe: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Introvert</span>
            <span>Ambivert</span>
            <span>Extrovert</span>
          </div>
          <div className="text-center mt-4">
            <Badge variant="outline" className="text-lg px-4 py-1">
              {VIBE_LABELS[Math.floor((profile.social_vibe - 1) / 2)]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Free Time</CardTitle>
          <CardDescription>When do you usually have free time?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FREE_TIME.map((slot) => (
              <Badge
                key={slot}
                variant={profile.free_time_slots.includes(slot) ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 ${
                  profile.free_time_slots.includes(slot) ? "bg-amber-500 hover:bg-amber-600" : ""
                }`}
                onClick={() => toggleArray("free_time_slots", slot)}
              >
                {slot}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
