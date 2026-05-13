"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Heart, ArrowRight, Phone, MessageSquare, User } from "lucide-react";
import { useRouter } from "next/navigation";

type Step = "phone" | "otp" | "name";

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8") && digits.length === 11) return "+7" + digits.slice(1);
  if (digits.startsWith("7") && digits.length === 11) return "+" + digits;
  if (digits.length === 10) return "+7" + digits;
  return "+" + digits;
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [normalized, setNormalized] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    setError("");
    const norm = normalizePhone(phone);
    if (norm.replace(/\D/g, "").length < 11) {
      setError("Введите корректный номер телефона");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: norm });
    if (error) {
      setError("Не удалось отправить код. Проверьте номер телефона.");
    } else {
      setNormalized(norm);
      setStep("otp");
    }
    setLoading(false);
  }

  async function handleVerifyOtp() {
    setError("");
    if (otp.length < 4) { setError("Введите код из SMS"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: normalized,
      token: otp,
      type: "sms",
    });
    if (error) {
      setError("Неверный код. Попробуйте ещё раз.");
      setLoading(false);
      return;
    }
    const userId = data.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();
      if (!profile?.full_name) {
        setStep("name");
        setLoading(false);
        return;
      }
    }
    router.push("/profile");
  }

  async function handleSaveName() {
    setError("");
    if (!fullName.trim()) { setError("Введите ваше имя"); return; }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName.trim(),
        role: "user",
      });
    }
    router.push("/profile");
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

        <div className="rounded-2xl p-8 border" style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>

          {step === "phone" && (
            <>
              <h1 className="text-2xl font-bold mb-1">Войти</h1>
              <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
                Введите номер телефона — пришлём код подтверждения
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Номер телефона</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+7 900 000 00 00"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border"
                      style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                      onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {loading ? "Отправляем..." : <><span>Получить код</span> <ArrowRight size={16} /></>}
                </button>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <h1 className="text-2xl font-bold mb-1">Код из SMS</h1>
              <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
                Отправили код на <strong>{normalized}</strong>
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Код подтверждения</label>
                  <div className="relative">
                    <MessageSquare size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border tracking-widest"
                      style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                      onKeyDown={e => e.key === "Enter" && handleVerifyOtp()}
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {loading ? "Проверяем..." : <><span>Войти</span> <ArrowRight size={16} /></>}
                </button>
                <button
                  onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                  className="text-xs text-center hover:opacity-70 transition-opacity"
                  style={{ color: "var(--muted)" }}
                >
                  Изменить номер
                </button>
              </div>
            </>
          )}

          {step === "name" && (
            <>
              <h1 className="text-2xl font-bold mb-1">Ваше имя</h1>
              <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
                Как к вам обращаться?
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Имя и фамилия</label>
                  <div className="relative">
                    <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Иван Иванов"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border"
                      style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                      onKeyDown={e => e.key === "Enter" && handleSaveName()}
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  onClick={handleSaveName}
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {loading ? "Сохраняем..." : <><span>Продолжить</span> <ArrowRight size={16} /></>}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
