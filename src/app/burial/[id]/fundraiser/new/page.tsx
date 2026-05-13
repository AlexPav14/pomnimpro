"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Heart, ArrowLeft, Coins, Info } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function NewFundraiserPage() {
  const router = useRouter();
  const params = useParams();
  const burialId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [burialName, setBurialName] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    goal_amount: "",
  });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: burial } = await supabase
        .from("burials")
        .select("full_name, created_by")
        .eq("id", burialId)
        .single();

      if (!burial) { router.push("/profile"); return; }
      if (burial.created_by !== user.id) { router.push(`/burial/${burialId}`); return; }

      setBurialName(burial.full_name);

      // Проверяем нет ли уже активного сбора
      const { data: existing } = await supabase
        .from("fundraisers")
        .select("id")
        .eq("burial_id", burialId)
        .in("status", ["active", "completed"])
        .maybeSingle();

      if (existing) { router.push(`/burial/${burialId}`); return; }

      setLoading(false);
    }
    load();
  }, [burialId, router]);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setError("");
    if (!form.title.trim()) { setError("Введите название сбора"); return; }
    const goal = parseInt(form.goal_amount.replace(/\D/g, ""));
    if (!goal || goal < 1000) { setError("Минимальная сумма сбора — 1 000 ₽"); return; }

    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error } = await supabase.from("fundraisers").insert({
      burial_id: burialId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      goal_amount: goal,
      collected_amount: 0,
      status: "active",
      created_by: user.id,
    });

    if (error) {
      setError("Ошибка при создании сбора. Попробуйте ещё раз.");
      setSaving(false);
      return;
    }

    router.push(`/burial/${burialId}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-sm" style={{ color: "var(--muted)" }}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>

      {/* Шапка */}
      <header style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart size={18} style={{ color: "var(--accent-gold)" }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>
              Помним про...
            </span>
          </Link>
          <Link href={`/burial/${burialId}`} className="text-sm hover:opacity-70" style={{ color: "var(--muted)" }}>
            Отмена
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto w-full px-6 py-12">

        {/* Заголовок */}
        <div className="mb-8">
          <Link
            href={`/burial/${burialId}`}
            className="flex items-center gap-1 text-xs mb-4 hover:opacity-70 transition-opacity"
            style={{ color: "var(--muted)" }}
          >
            <ArrowLeft size={12} />
            Назад к паспорту
          </Link>
          <div className="text-xs font-mono mb-1" style={{ color: "var(--muted)" }}>Сбор средств</div>
          <h1 className="text-2xl font-bold">Открыть сбор</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{burialName}</p>
        </div>

        {/* Форма */}
        <div
          className="rounded-2xl p-6 border flex flex-col gap-5 mb-5"
          style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Название сбора <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="На установку памятника"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
              style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Описание</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Расскажите подробнее о цели сбора..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border resize-none"
              style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Сумма сбора (₽) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.goal_amount}
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const num = parseInt(raw);
                  set("goal_amount", raw ? num.toLocaleString("ru-RU") : "");
                }}
                placeholder="19 000"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border pr-10"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--muted)" }}>₽</span>
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Минимум 1 000 ₽</p>
          </div>
        </div>

        {/* Инфо об эскроу */}
        <div
          className="rounded-xl p-4 border flex gap-3 mb-6"
          style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
        >
          <Info size={15} className="flex-shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            Деньги хранятся на защищённом эскроу-счёте. Агентство получает оплату только после того, как вы подтвердите выполнение работ и загрузку фотоотчёта.
          </p>
        </div>

        {/* Ошибка */}
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* Кнопка */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--accent)", color: "white" }}
        >
          <Coins size={15} />
          {saving ? "Создаём сбор..." : "Открыть сбор"}
        </button>

      </div>
    </div>
  );
}
