export interface User {
  id: string;
  email: string;
  display_name: string | null;
  is_verified: boolean;
  onboarding_complete: boolean;
  tier: "explorer" | "social_scout" | "community_connector";
  created_at: string;
}

export interface Subscription {
  tier: "explorer" | "social_scout" | "community_connector";
  status: "active" | "inactive";
  current_period_end: string | null;
}

export interface Profile {
  id: string;
  user_id: string;
  move_date: string;
  city: string;
  neighborhood: string;
  goals: string[];
  interest_tags: string[];
  social_vibe: number;
  free_time_slots: string[];
  tier: "explorer" | "social_scout" | "community_connector";
  updated_at: string;
}

export interface EventCard {
  id: string;
  name: string;
  event_date: string;
  neighborhood: string;
  city: string;
  vibe_tags: string[];
  ai_description: string;
  why_for_you: string;
  is_early_access: boolean;
  rating: "interested" | "not_for_me" | "attended" | null;
}

export interface DigestResponse {
  events: EventCard[];
  total: number;
}

export interface Community {
  id: string;
  city: string;
  name: string;
  theme: string;
  description: string;
  size_min: number;
  size_max: number;
  is_joined: boolean;
}

export interface Outcomes {
  events_attended: number;
  connections_made: number;
  current_streak: number;
}

export interface CheckoutResponse {
  price_id: string;
  client_token: string;
}