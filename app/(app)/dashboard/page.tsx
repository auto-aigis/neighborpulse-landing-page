"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { digestApi, eventsApi } from "../../_lib/api";
import { useAuth } from "../../_components/AuthProvider";
import type { EventCard } from "../../_lib/types";
import { Sparkles, Clock, MapPin, ThumbsUp, ThumbsDown, CheckCircle, Star, RefreshCw, Mail, Crown, Zap } from "lucide-react";

function DashboardContent() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<EventCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const checkoutSuccess = searchParams.get("checkout") === "success";
  const transactionId = searchParams.get("transaction_id");

  useEffect(() => {
    loadDigest();
  }, []);

  useEffect(() => {
    if (checkoutSuccess && transactionId) {
      handleVerifyTransaction(transactionId);
    }
  }, [checkoutSuccess, transactionId]);

  const loadDigest = async () => {
    try {
      const data = await digestApi.get();
      setEvents(data.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTransaction = async (txnId: string) => {
    setProcessingPayment(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/paddle/verify-transaction`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: txnId }),
      });
      if (res.ok) {
        await refresh();
        router.replace("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      await digestApi.generate();
      await loadDigest();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    try {
      await digestApi.sendEmail();
      alert("Digest sent to your email!");
    } catch (err) {
      console.error(err);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleRate = async (eventId: string, rating: "interested" | "not_for_me" | "attended") => {
    try {
      const result = await eventsApi.rate(eventId, rating);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, rating } : e))
      );
      if (result.show_connection_prompt) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId ? { ...e, rating: "attended", showPrompt: true } : e
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnection = async (eventId: string, outcome: "yes" | "no" | "maybe") => {
    try {
      await eventsApi.connection(eventId, outcome);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, showPrompt: false } : e))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const isPremium = user?.tier !== "explorer";
  const maxEvents = isPremium ? 5 : 3;

  return (
    <div className="space-y-6">
      {(processingPayment || (checkoutSuccess && !transactionId)) && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-amber-800">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Processing payment... please wait</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Weekly Digest</h1>
          <p className="text-gray-600">Curated events just for you</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRegenerate} disabled={generating}>
            <RefreshCw className={`w-4 h-4 mr-2 ${generating ? "animate-spin" : ""}`} />
            {generating ? "Generating..." : "Regenerate"}
          </Button>
          <Button variant="outline" onClick={handleSendEmail} disabled={sendingEmail}>
            <Mail className="w-4 h-4 mr-2" />
            {sendingEmail ? "Sending..." : "Send to Email"}
          </Button>
        </div>
      </div>

      {!isPremium && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-amber-500" />
              <div>
                <p className="font-medium text-gray-900">Upgrade to unlock more events</p>
                <p className="text-sm text-gray-600">Get 5 events per week + early access + premium features</p>
              </div>
            </div>
            <Link href="/pricing">
              <Button className="bg-amber-500 hover:bg-amber-600">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-4">No events yet. Generate your first digest!</p>
              <Button onClick={handleRegenerate} disabled={generating}>
                Generate Digest
              </Button>
            </CardContent>
          </Card>
        ) : (
          events.slice(0, maxEvents).map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      {event.is_early_access && (
                        <Badge className="bg-purple-100 text-purple-700">Early Access</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(event.event_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.neighborhood}, {event.city}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{event.ai_description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.vibe_tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-500 mt-0.5" />
                    <p className="text-sm text-amber-800">{event.why_for_you}</p>
                  </div>
                </div>
                {event.showPrompt && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-green-800 mb-2">
                      Did you make a new connection?
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleConnection(event.id, "yes")}>
                        Yes
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleConnection(event.id, "no")}>
                        No
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleConnection(event.id, "maybe")}>
                        Maybe
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={event.rating === "interested" ? "default" : "outline"}
                    onClick={() => handleRate(event.id, "interested")}
                    className={event.rating === "interested" ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Interested
                  </Button>
                  <Button
                    size="sm"
                    variant={event.rating === "not_for_me" ? "default" : "outline"}
                    onClick={() => handleRate(event.id, "not_for_me")}
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Not for me
                  </Button>
                  <Button
                    size="sm"
                    variant={event.rating === "attended" ? "default" : "outline"}
                    onClick={() => handleRate(event.id, "attended")}
                    className={event.rating === "attended" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Attended
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
