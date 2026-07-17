"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import LoginForm from "./components/LoginForm";
import AdminPanel from "./components/AdminPanel";

// Comma-separated allowlist of owner emails, set in the Vercel project env.
// Signup is open on this Supabase project, so any stranger can create an account
// and reach a logged-in state; this restricts the panel to the owner. Until the
// env var is set it falls back to "any authenticated user" so it cannot lock the
// owner out — set NEXT_PUBLIC_ADMIN_EMAILS AND disable signup to fully close it.
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAllowed(session: Session | null): boolean {
  if (!session) return false;
  if (ADMIN_EMAILS.length === 0) return true;
  const email = session.user.email?.toLowerCase();
  return !!email && ADMIN_EMAILS.includes(email);
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <main className="min-h-screen bg-white" />;
  }

  if (!session) {
    return <LoginForm />;
  }

  if (!isAllowed(session)) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-sm tracking-widest uppercase text-gray-600">
          This account is not authorized for the YZS admin.
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="border border-black px-8 py-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors"
        >
          Sign out
        </button>
      </main>
    );
  }

  return <AdminPanel />;
}
