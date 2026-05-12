"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Неверный email или пароль");
    } else {
      router.push("/");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--background)" }}>

      <div className="w-full max-w-sm">

        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <Heart size={18} style={{ color: "var(--accent-gold)" }} />
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>
            Помним про...
          </span>
        </Link>

        {/* Карточка */}
        <div
          className="rounded-2xl p-8 border"
          style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
        >
          <h1 className="text-2xl font-bold mb-1">Войти</h1>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
            Нет аккаунта?{" "}
            <Link href="/register" className="underline hover:opacity-70" style={{ color: "var(--accent)" }}>
              Зарегистрироваться
            </Link>
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)"
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)"
                }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: "var(--accent)", color: "white" }}
            >
              {loading ? "Входим..." : <>Войти <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
