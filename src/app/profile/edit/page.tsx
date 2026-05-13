"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Heart, ArrowLeft, Save, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      setPhone(user.phone || user.email || "");

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      setFullName(prof?.full_name || "");
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave() {
    setError("");
    setSuccess(false);
    if (!fullName.trim()) { setError("Введите имя"); return; }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", user.id);

    if (error) {
      setError("Ошибка при сохранении. Попробуйте ещё раз.");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    setTimeout(() => router.push("/profile"), 1000);
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
          <Link href="/profile" className="text-sm hover:opacity-70" style={{ color: "var(--muted)" }}>
            Отмена
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto w-full px-6 py-12">

        {/* Заголовок */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="flex items-center gap-1 text-xs mb-4 hover:opacity-70 transition-opacity"
            style={{ color: "var(--muted)" }}
          >
            <ArrowLeft size={12} />
            Назад в профиль
          </Link>
          <div className="text-xs font-mono mb-1" style={{ color: "var(--muted)" }}>Личный кабинет</div>
          <h1 className="text-2xl font-bold">Редактирование профиля</h1>
        </div>

        {/* Аватар */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{ background: "var(--accent)", color: "white" }}
          >
            {fullName?.[0]?.toUpperCase() || <User size={28} />}
          </div>
        </div>

        {/* Форма */}
        <div
          className="rounded-2xl p-6 border flex flex-col gap-5"
          style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Имя и фамилия</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Иван Иванов"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
              style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Телефон</label>
            <input
              type="text"
              value={phone}
              disabled
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border opacity-50 cursor-not-allowed"
              style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <p className="text-xs" style={{ color: "var(--muted)" }}>Телефон изменить нельзя</p>
          </div>
        </div>

        {/* Ошибка / успех */}
        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
        {success && <p className="text-sm text-green-600 mt-4">Сохранено — возвращаемся в профиль...</p>}

        {/* Кнопка */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--accent)", color: "white" }}
        >
          <Save size={15} />
          {saving ? "Сохраняем..." : "Сохранить"}
        </button>

      </div>
    </div>
  );
}
