"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Wrong email or password");
    setBusy(false);
  };

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-3xl font-black italic tracking-wider uppercase">Admin</h1>
        <input
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b border-black/30 focus:border-black transition-colors py-2 text-xs tracking-widest outline-none"
          required
        />
        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b border-black/30 focus:border-black transition-colors py-2 text-xs tracking-widest outline-none"
          required
        />
        {error && <p className="text-xs text-red-600 tracking-widest uppercase">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="bg-black text-white py-3 text-[11px] font-bold tracking-[0.2em] uppercase disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
