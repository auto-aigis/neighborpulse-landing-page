"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  Brain,
  MapPin,
  Bell,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Radio,
  Users,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <Radio className="h-6 w-6 text-violet-500" />,
      title: "Multi-Source Signal Aggregation",
      description:
        "We scan Instagram stories, Facebook groups, Nextdoor posts, Reddit city subreddits, and Telegram neighborhood chats to find events others miss.",
    },
    {
      icon: <Brain className="h-6 w-6 text-violet-500" />,
      title: "NLP-Powered Understanding",
      description:
        "Our AI reads unstructured social posts like a human would — extracting event details, dates, vibes, and context from casual language.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-violet-500" />,
      title: "Personalized Taste Matching",
      description:
        "Set your vibe profile — music, food, art, fitness, networking — and get recommendations that actually match your interests.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-violet-500" />,
      title: "Weekly AI-Written Digest",
      description:
        "Every week, receive a beautifully curated briefing with event summaries, vibe descriptions, and personalized reasons why each pick suits you.",
    },
    {
      icon: <MapPin className="h-6 w-6 text-violet-500" />,
      title: "Hyperlocal Discovery",
      description:
        "Enter your neighborhood or city and discover grassroots happenings within walking distance that never make it to event platforms.",
    },
    {
      icon: <Bell className="h-6 w-6 text-violet-500" />,
      title: "Real-Time Alerts",
      description:
        "Get instant notifications for high-match events that pop up mid-week — pop-ups, secret shows, flash sales, and spontaneous meetups.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Set Your Vibe Profile",
      description:
        "Tell us what excites you — live music, street food, gallery openings, yoga in the park, or tech meetups. The more you share, the better your matches.",
      icon: <Users className="h-8 w-8 text-violet-500" />,
    },
    {
      number: "02",
      title: "Pin Your Neighborhood",
      description:
        "Drop a pin or enter your area. We focus our AI scouts on hyper-local signals within your preferred radius.",
      icon: <MapPin className="h-8 w-8 text-violet-500" />,
    },
    {
      number: "03",
      title: "AI Scouts the Social Web",
      description:
        "Our NLP engine continuously scans unstructured posts across 5+ platforms, identifying events that traditional listings completely miss.",
      icon: <Brain className="h-8 w-8 text-violet-500" />,
    },
    {
      number: "04",
      title: "Get Your Personalized Digest",
      description:
        "Every week, open a beautifully written briefing explaining what to do, why it matches your vibe, and what to expect.",
      icon: <Zap className="h-8 w-8 text-violet-500" />,
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with local discovery",
      features: [
        "1 weekly digest email",
        "3 interest categories",
        "1 neighborhood zone",
        "Basic event summaries",
        "Community picks section",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For the urban explorer who wants to catch everything",
      features: [
        "Unlimited weekly digests",
        "All interest categories",
        "Up to 5 neighborhood zones",
        "AI-written vibe descriptions",
        "Real-time mid-week alerts",
        "Personalized match scores",
        "Calendar integration",
      ],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Crew",
      price: "$19",
      period: "per month",
      description: "Share discoveries with your friend group",
      features: [
        "Everything in Pro",
        "Up to 6 crew members",
        "Group vibe matching",
        "Shared event boards",
        "Crew digest for group plans",
        "Priority support",
        "Early access to new features",
      ],
      highlighted: false,
    },
  ];

  const faqItems = [
    {
      question: "How is NeighborPulse different from Eventbrite or Meetup?",
      answer:
        "Traditional event platforms only list structured events that organizers manually post. NeighborPulse uses AI to find the 70-80% of local happenings that only exist as casual mentions in Instagram stories, Facebook group posts, Reddit threads, and neighborhood chats — the grassroots events you would otherwise miss entirely.",
    },
    {
      question: "Which social platforms do you scan?",
      answer:
        "We currently aggregate signals from Instagram stories, Facebook groups, Nextdoor posts, Reddit city subreddits, and Telegram neighborhood chats. We are continuously adding more sources based on user feedback.",
    },
    {
      question: "How does the taste profile work?",
      answer:
        "You select and weight your interests across categories like music genres, food types, art forms, fitness activities, and professional networking. Our AI then scores each discovered event against your profile and explains why each recommendation matches your vibe.",
    },
    {
      question: "Is my data private?",
      answer:
        "Absolutely. We only scan publicly available posts and group content. Your personal taste profile is encrypted and never shared. We do not sell user data or run ads.",
    },
    {
      question: "Which cities are supported?",
      answer:
        "We are currently live in 50+ major US cities and expanding internationally. If your city is not yet covered, sign up and we will prioritize adding it based on demand.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Radio className="h-6 w-6 text-violet-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                NeighborPulse
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login">
                <Button variant="ghost" className="text-sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="text-sm bg-violet-600 hover:bg-violet-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <Separator />
              <a href="/login">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="w-full text-sm bg-violet-600 hover:bg-violet-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              AI-Powered Local Discovery
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Your AI social scout —{" "}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                never miss a local event
              </span>{" "}
              that matches your vibe again
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              NeighborPulse uses AI to scan Instagram stories, Facebook groups, Reddit threads, and more — delivering a
              personalized weekly digest of grassroots events you{"'"}d otherwise never find.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-base">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                  See How It Works
                </Button>
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Free forever plan available • No credit card required
            </p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                      <Star className="h-4 w-4 text-pink-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">Instagram Story Signal</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    {"\""}Secret DJ set at Warehouse 9 this Saturday — doors at 10pm, no cover{"\""}
                  </p>
                  <Badge className="mt-3 bg-violet-100 text-violet-700 hover:bg-violet-100">98% match</Badge>
                </div>
                <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">Facebook Group Post</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    {"\""}Pop-up ramen night at the community garden — bring your own bowl!{"\""}
                  </p>
                  <Badge className="mt-3 bg-violet-100 text-violet-700 hover:bg-violet-100">92% match</Badge>
                </div>
                <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-orange-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">Reddit Thread</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    {"\""}Free outdoor yoga every Sunday at Riverside Park, all levels welcome{"\""}
                  </p>
                  <Badge className="mt-3 bg-violet-100 text-violet-700 hover:bg-violet-100">87% match</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Discover events that live outside traditional platforms
            </h2>
            <p className="text-lg text-gray-600">
              70-80% of real grassroots local happenings only exist as unstructured social media posts. Our AI finds them all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-violet-50 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              From setup to personalized digest in minutes
            </h2>
            <p className="text-lg text-gray-600">
              Four simple steps to never miss a local event that matches your vibe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-5">
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-2">
                    Step {step.number}
                  </span>
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%_-_16px)] w-8">
                    <ArrowRight className="h-5 w-5 text-violet-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Plans for every explorer
            </h2>
            <p className="text-lg text-gray-600">
              Start free and upgrade when you want more neighborhoods, real-time alerts, and crew features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${
                  tier.highlighted
                    ? "border-violet-500 shadow-xl scale-105 ring-2 ring-violet-500/20"
                    : "border-gray-200"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-600 text-white hover:bg-violet-600">{tier.badge}</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-gray-500 ml-1">/{tier.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${
                        tier.highlighted
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : ""
                      }`}
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about NeighborPulse.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stop discovering events after they{"'"}ve already happened
          </h2>
          <p className="text-lg text-violet-100 mb-8 max-w-2xl mx-auto">
            Join thousands of urban explorers who never miss a local event that matches their vibe. Set up your profile in 2 minutes and get your first personalized digest this week.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-gray-100 px-8 py-6 text-base font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="/login">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base">
                Sign In
              </Button>
            </a>
          </div>
          <p className="mt-6 text-sm text-violet-200">
            No credit card required • Free plan available forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-violet-400" />
              <span className="text-lg font-bold text-white">NeighborPulse</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <a href="/login" className="hover:text-white transition-colors">Sign In</a>
              <a href="/register" className="hover:text-white transition-colors">Get Started</a>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <p className="text-center text-sm text-gray-500">
            © 2024 NeighborPulse. All rights reserved. Your AI social scout for local discovery.
          </p>
        </div>
      </footer>
    </div>
  );
}