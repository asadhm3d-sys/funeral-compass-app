/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LocalRepository } from "./localRepository";
import { SupabaseRepository, getSupabase } from "./supabaseRepository";
import type { PlanRepository } from "./types";

// =====================================================================
// Repository factory + lightweight auth.
//  - Supabase configured  → real magic-link login (signInWithOtp).
//  - Not configured (demo) → simulated magic link: the user enters an
//    email, we show the "link" instantly and sign them in locally.
//    No passwords anywhere, by design.
// =====================================================================

export const getRepository = (): PlanRepository => {
  const client = getSupabase();
  return client ? new SupabaseRepository(client) : new LocalRepository();
};

const SESSION_KEY = "funeral-compass:session:v1";

export interface AuthSession {
  email: string;
  /** local = simulated demo session; supabase = real auth session */
  kind: "local" | "supabase";
}

interface AuthContextValue {
  session: AuthSession | null;
  backend: "local" | "supabase";
  /** Sends (or simulates) a magic link. Resolves when the email is "out". */
  requestMagicLink: (email: string) => Promise<void>;
  /** Local mode only: completes the simulated magic-link sign-in. */
  completeLocalSignIn: (email: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  backend: "local",
  requestMagicLink: async () => {},
  completeLocalSignIn: () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = getSupabase();
  const backend: "local" | "supabase" = supabase ? "supabase" : "local";
  const [session, setSession] = useState<AuthSession | null>(null);

  // hydrate
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        const email = data.session?.user?.email;
        setSession(email ? { email, kind: "supabase" } : null);
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
        const email = s?.user?.email;
        setSession(email ? { email, kind: "supabase" } : null);
      });
      return () => sub.subscription.unsubscribe();
    }
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setSession(JSON.parse(raw) as AuthSession);
    } catch {
      // ignore
    }
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      backend,
      requestMagicLink: async (email: string) => {
        if (supabase) {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin + "/account" },
          });
          if (error) throw error;
        }
        // local mode: nothing to send — the Account page completes sign-in
      },
      completeLocalSignIn: (email: string) => {
        if (supabase) return; // real backend handles its own callback
        const s: AuthSession = { email: email.trim().toLowerCase(), kind: "local" };
        setSession(s);
        try {
          localStorage.setItem(SESSION_KEY, JSON.stringify(s));
        } catch {
          // ignore
        }
      },
      signOut: async () => {
        if (supabase) await supabase.auth.signOut();
        setSession(null);
        try {
          localStorage.removeItem(SESSION_KEY);
        } catch {
          // ignore
        }
      },
    }),
    [session, backend, supabase],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

/** Owner key used for plans: signed-in email, or a stable guest id. */
export const useOwner = (): string => {
  const { session } = useAuth();
  if (session) return session.email;
  const GUEST_KEY = "funeral-compass:guest-id";
  try {
    let id = localStorage.getItem(GUEST_KEY);
    if (!id) {
      id = `guest-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(GUEST_KEY, id);
    }
    return id;
  } catch {
    return "guest";
  }
};
