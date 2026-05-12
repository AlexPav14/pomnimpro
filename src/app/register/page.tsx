"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Создаём профиль
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        role: "user"
      });
      setDone(true);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--background)" }}>
        <div className="w-full max-w-sm text-center">
          <Heart size={32} className="mx-auto mb-4" style={{ color: "var(--accent-gold)" }} />
          <h1 className="text-2xl font-bold mb-2">Проверьте почту</h1>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            Мы отправили ссылку для подтверждения на <strong>{email}</strong>
          </p>
          <Link
            href="/login"
            className="text-sm underline hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            Перейти ко входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-sm">

        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <Heart size={18} style={{ color: "var(--accent-gold)" }} />
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>
            Помним про...
          </span>
        </Link>

        <div
          className="rounded-2xl p-8 border"
          style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
        >
          <h1 className="text-2xl font-bold mb-1">Регистрация</h1>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
            Уже есть аккаунт?{" "}
            <Link href="/login" className="underline hover:opacity-70" style={{ color: "var(--accent)" }}>
              Войти
            </Link>
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Имя и фамилия</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Иван Иванов"
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
                placeholder="минимум 6 символов"
                minLength={6}
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
              {loading ? "Создаём аккаунт..." : <>Зарегистрироваться <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
