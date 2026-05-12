"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Heart, MapPin, Calendar, Plus, LogOut, ChevronRight, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface Burial {
  id: string;
  full_name: string;
  birth_date: string | null;
  death_date: string | null;
  region: string | null;
  photo_main_url: string | null;
  status: string;
  created_at: string;
}

interface Profile {
  full_name: string | null;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [phone, setPhone] = useState("");
  const [burials, setBurials] = useState<Burial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      setPhone(user.phone || "");

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();
      setProfile(prof);

      const { data: bur } = await supabase
        .from("burials")
        .select("id, full_name, birth_date, death_date, region, photo_main_url, status, created_at")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });
      setBurials(bur || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const statusLabel: Record<string, { label: string; color: string }> = {
    published: { label: "Опубликовано", color: "#16a34a" },
    draft: { label: "Черновик", color: "#d97706" },
    pending_payment: { label: "Ожидает оплаты", color: "#dc2626" },
  };

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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            <LogOut size={14} />
            Выйти
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto w-full px-6 py-10">

        {/* Профиль */}
        <div
          className="rounded-2xl p-6 border mb-8 flex items-center justify-between"
          style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
              style={{ background: "var(--accent)", color: "white" }}
            >
              {(profile?.full_name || phone)?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-semibold">{profile?.full_name || "Пользователь"}</p>
              {phone && <p className="text-sm" style={{ color: "var(--muted)" }}>{phone}</p>}
              <span
                className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{ background: "var(--surface)", color: "var(--muted)" }}
              >
                {profile?.role === "agency" ? "Агентство" : profile?.role === "admin" ? "Администратор" : "Пользователь"}
              </span>
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-colors hover:bg-black hover:text-white"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <Pencil size={13} />
            Изменить
          </Link>
        </div>

        {/* Мои записи */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-mono mb-1" style={{ color: "var(--muted)" }}>Личный кабинет</div>
            <h1 className="text-2xl font-bold">Мои записи</h1>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <Plus size={14} />
            Добавить
          </Link>
        </div>

        {burials.length === 0 ? (
          <div
            className="rounded-2xl p-12 border text-center"
            style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
          >
            <Heart size={32} className="mx-auto mb-3" style={{ color: "var(--border)" }} />
            <p className="text-sm font-medium mb-1">Записей пока нет</p>
            <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>
              Создайте первую страницу памяти
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "white" }}
            >
              <Plus size={14} />
              Создать запись
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {burials.map(burial => {
              const birthYear = burial.birth_date ? new Date(burial.birth_date).getFullYear() : null;
              const deathYear = burial.death_date ? new Date(burial.death_date).getFullYear() : null;
              const years = birthYear && deathYear ? `${birthYear} – ${deathYear}` : birthYear ? `р. ${birthYear}` : deathYear ? `† ${deathYear}` : null;
              const st = statusLabel[burial.status] || { label: burial.status, color: "var(--muted)" };

              return (
                <div
                  key={burial.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
                >
                  <div
                    className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ background: "var(--surface)" }}
                  >
                    {burial.photo_main_url ? (
                      <img src={burial.photo_main_url} alt={burial.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <Heart size={20} style={{ color: "var(--border)" }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{burial.full_name}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {years && (
                        <span className="text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
                          <Calendar size={11} />{years}
                        </span>
                      )}
                      {burial.region && (
                        <span className="text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
                          <MapPin size={11} />{burial.region}
                        </span>
                      )}
                    </div>
                    <span className="text-xs mt-1 inline-block" style={{ color: st.color }}>
                      {st.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/burial/${burial.id}/edit`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-black hover:text-white"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                    >
                      <Pencil size={13} />
                    </Link>
                    <Link
                      href={`/burial/${burial.id}`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-black hover:text-white"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                    >
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
