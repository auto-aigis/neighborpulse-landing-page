"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { onboardingApi } from "../_lib/api";
import { useAuth } from "../_components/AuthProvider";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Target, Sparkles, Users, Clock } from "lucide-react";

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

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    move_date: "",
    city: "",
    neighborhood: "",
    goals: [] as string[],
    interest_tags: [] as string[],
    social_vibe: 3,
    free_time_slots: [] as string[],
  });

  useEffect(() => {
    if (user?.onboarding_complete) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onboardingApi.save(formData);
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleArray = (field: "goals" | "interest_tags" | "free_time_slots", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-semibold">When did you move to your current city?</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">Select the date you relocated (past 24 months)</p>
            <Input
              type="date"
              value={formData.move_date}
              onChange={(e) => setFormData({ ...formData, move_date: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
              min={new Date(Date.now() - 24 * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              className="max-w-xs"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-semibold">Which city and neighborhood?</h2>
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <select
                className="w-full p-2 border rounded-md bg-white"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
                placeholder="e.g., Downtown, East Austin, RiNo"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-semibold">What are your first 90 days goals?</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((goal) => (
                <Badge
                  key={goal}
                  variant={formData.goals.includes(goal) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 ${
                    formData.goals.includes(goal) ? "bg-amber-500 hover:bg-amber-600" : ""
                  }`}
                  onClick={() => toggleArray("goals", goal)}
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-semibold">What&apos;s your vibe?</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">Select your interests</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <Badge
                  key={interest}
                  variant={formData.interest_tags.includes(interest) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 ${
                    formData.interest_tags.includes(interest) ? "bg-amber-500 hover:bg-amber-600" : ""
                  }`}
                  onClick={() => toggleArray("interest_tags", interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-semibold">How social do you like to be?</h2>
            </div>
            <p className="text-gray-600 text-sm mb-6">Slide to match your social energy</p>
            <div className="py-8">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData.social_vibe}
                onChange={(e) => setFormData({ ...formData, social_vibe: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Introvert</span>
                <span>Ambivert</span>
                <span>Extrovert</span>
              </div>
              <div className="text-center mt-4">
                <Badge variant="outline" className="text-lg px-4 py-1">
                  {VIBE_LABELS[Math.floor((formData.social_vibe - 1) / 2)]}
                </Badge>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-semibold">What&apos;s your typical free time?</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {FREE_TIME.map((slot) => (
                <Badge
                  key={slot}
                  variant={formData.free_time_slots.includes(slot) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 ${
                    formData.free_time_slots.includes(slot) ? "bg-amber-500 hover:bg-amber-600" : ""
                  }`}
                  onClick={() => toggleArray("free_time_slots", slot)}
                >
                  {slot}
                </Badge>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!formData.move_date;
      case 2:
        return !!formData.city && !!formData.neighborhood;
      case 3:
        return formData.goals.length > 0;
      case 4:
        return formData.interest_tags.length > 0;
      case 5:
        return true;
      case 6:
        return formData.free_time_slots.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-8">
          <Progress value={(step / 6) * 100} className="mb-8" />
          <div className="min-h-[300px]">{renderStep()}</div>
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {step < 6 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || loading}>
                {loading ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
