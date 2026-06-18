const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(", ");
      else if (err.error) msg = err.error;
    } catch {}
    if (res.status === 403 && msg.includes("not verified")) {
      throw new Error("email_not_verified");
    }
    if (res.status === 403 && msg.includes("Community Connector")) {
      throw new Error("upgrade_required");
    }
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string) =>
    apiFetch<{ status: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  login: (email: string, password: string) =>
    apiFetch<import("./types").User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<{ status: string }>("/api/auth/logout", {
      method: "POST",
    }),

  me: () => apiFetch<import("./types").User>("/api/auth/me"),

  subscription: () =>
    apiFetch<import("./types").Subscription>("/api/auth/subscription"),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const profileApi = {
  get: () => apiFetch<import("./types").Profile>("/api/profile"),

  update: (data: Partial<import("./types").Profile>) =>
    apiFetch<{ status: string }>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const onboardingApi = {
  save: (data: {
    move_date: string;
    city: string;
    neighborhood: string;
    goals: string[];
    interest_tags: string[];
    social_vibe: number;
    free_time_slots: string[];
  }) =>
    apiFetch<{ status: string }>("/api/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const digestApi = {
  get: () =>
    apiFetch<import("./types").DigestResponse>("/api/digest"),

  generate: () =>
    apiFetch<{ status: string }>("/api/digest/generate", {
      method: "POST",
    }),

  sendEmail: () =>
    apiFetch<{ status: string }>("/api/digest/send-email", {
      method: "POST",
    }),
};

export const eventsApi = {
  rate: (
    eventId: string,
    rating: "interested" | "not_for_me" | "attended"
  ) =>
    apiFetch<{ status: string; show_connection_prompt: boolean }>(
      `/api/events/${eventId}/rate`,
      {
        method: "POST",
        body: JSON.stringify({ rating }),
      }
    ),

  connection: (
    eventId: string,
    outcome: "yes" | "no" | "maybe"
  ) =>
    apiFetch<{ status: string }>(`/api/events/${eventId}/connection`, {
      method: "POST",
      body: JSON.stringify({ outcome }),
    }),
};

export const communitiesApi = {
  list: () => apiFetch<import("./types").Community[]>("/api/communities"),

  join: (communityId: string) =>
    apiFetch<{ status: string }>(`/api/communities/${communityId}/join`, {
      method: "POST",
    }),
};

export const outcomesApi = {
  get: () => apiFetch<import("./types").Outcomes>("/api/outcomes"),
};

export const settingsApi = {
  getApiKey: () =>
    apiFetch<{ configured: boolean }>("/api/settings/apikey"),

  setApiKey: (apiKey: string) =>
    apiFetch<{ status: string }>("/api/settings/apikey", {
      method: "PUT",
      body: JSON.stringify({ api_key: apiKey }),
    }),
};

export const paymentsApi = {
  checkout: (
    tier: "social_scout" | "community_connector",
    billingInterval: "monthly" | "yearly"
  ) =>
    apiFetch<import("./types").CheckoutResponse>("/api/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),
};
