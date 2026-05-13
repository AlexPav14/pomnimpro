import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, MapPin, Calendar, Lock, Share2, ChevronRight, Coins } from "lucide-react";
import { getTheme } from "@/lib/religionThemes";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BurialPage({ params }: Props) {
  const { id } = await params;

  const { data: burial, error } = await supabase
    .from("burials")
    .select("*, agencies(id, name, logo_url)")
    .eq("id", id)
    .single();

  if (error || !burial) notFound();

  const { data: fundraiser } = await supabase
    .from("fundraisers")
    .select("*")
    .eq("burial_id", id)
    .in("status", ["active", "completed"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const t = getTheme(burial.religion);
  const birthYear = burial.birth_date ? new Date(burial.birth_date).getFullYear() : null;
  const deathYear = burial.death_date ? new Date(burial.death_date).getFullYear() : null;
  const years = birthYear && deathYear ? `${birthYear} – ${deathYear}` : birthYear ? `р. ${birthYear}` : deathYear ? `† ${deathYear}` : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: t.bg, color: t.accentText }}>

      {/* Шапка */}
      <header style={{ background: t.bg, borderBottom: `1px solid ${t.border}` }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart size={18} style={{ color: t.accent }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: t.accent }}>
              Помним про...
            </span>
          </Link>
          <button
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-opacity hover:opacity-70"
            style={{ borderColor: t.border, color: t.muted }}
          >
            <Share2 size={14} />
            Поделиться
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto w-full px-6 py-10">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-1 text-xs mb-8" style={{ color: t.muted }}>
          <Link href="/" className="hover:opacity-70 transition-opacity">Главная</Link>
          <ChevronRight size={12} />
          <Link href="/search" className="hover:opacity-70 transition-opacity">Книга записей</Link>
          <ChevronRight size={12} />
          <span>{burial.full_name}</span>
        </div>

        {/* Символ вероисповедания */}
        {t.symbol && (
          <div className="text-center text-5xl mb-6 opacity-30" style={{ color: t.accent }}>
            {t.symbol}
          </div>
        )}

        {/* Основной контент */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

          {/* Основное фото — табличка */}
          <div
            className="rounded-2xl overflow-hidden border aspect-square flex items-center justify-center"
            style={{ background: t.surface, borderColor: t.border }}
          >
            {burial.photo_main_url ? (
              <img
                src={burial.photo_main_url}
                alt={`Табличка — ${burial.full_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2" style={{ color: t.muted }}>
                <Heart size={32} style={{ color: t.border }} />
                <span className="text-xs">Фото таблички</span>
              </div>
            )}
          </div>

          {/* Второстепенное фото + данные */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl overflow-hidden border flex-1 flex items-center justify-center"
              style={{ background: t.surface, borderColor: t.border, minHeight: "200px" }}
            >
              {burial.photo_general_url ? (
                <img
                  src={burial.photo_general_url}
                  alt={`Общий вид — ${burial.full_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2" style={{ color: t.muted }}>
                  <MapPin size={24} style={{ color: t.border }} />
                  <span className="text-xs">Общий вид захоронения</span>
                </div>
              )}
            </div>

            {/* Данные */}
            <div
              className="rounded-2xl p-6 border"
              style={{ background: t.surface2, borderColor: t.border }}
            >
              <h1 className="text-2xl font-bold mb-1" style={{ color: t.accentText }}>{burial.full_name}</h1>
              {years && (
                <p className="text-sm mb-3 flex items-center gap-1" style={{ color: t.muted }}>
                  <Calendar size={13} />
                  {years}
                </p>
              )}
              {burial.cemetery_name && (
                <p className="text-sm flex items-center gap-1 mb-1" style={{ color: t.muted }}>
                  <MapPin size={13} />
                  {burial.cemetery_name}
                </p>
              )}
              {burial.region && (
                <p className="text-sm" style={{ color: t.muted }}>{burial.region}</p>
              )}
              {burial.religion && (
                <p className="text-sm mt-2 flex items-center gap-1" style={{ color: t.accent }}>
                  {t.symbol} {burial.religion}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Жизненный путь */}
        {(burial.birth_place || burial.education || burial.military_service || burial.occupation || burial.biography) && (
          <div
            className="rounded-2xl p-8 border mb-8"
            style={{ background: t.surface2, borderColor: t.border }}
          >
            <div className="text-xs font-mono mb-5" style={{ color: t.muted }}>Жизненный путь</div>
            <div className="flex flex-col gap-4">
              {burial.birth_place && (
                <div>
                  <p className="text-xs mb-1" style={{ color: t.muted }}>Место рождения</p>
                  <p className="text-sm" style={{ color: t.accentText }}>{burial.birth_place}</p>
                </div>
              )}
              {burial.education && (
                <div>
                  <p className="text-xs mb-1" style={{ color: t.muted }}>Образование</p>
                  <p className="text-sm" style={{ color: t.accentText }}>{burial.education}</p>
                </div>
              )}
              {burial.military_service && (
                <div>
                  <p className="text-xs mb-1" style={{ color: t.muted }}>Служба в армии</p>
                  <p className="text-sm" style={{ color: t.accentText }}>{burial.military_service}</p>
                </div>
              )}
              {burial.occupation && (
                <div>
                  <p className="text-xs mb-1" style={{ color: t.muted }}>Место работы / профессия</p>
                  <p className="text-sm" style={{ color: t.accentText }}>{burial.occupation}</p>
                </div>
              )}
              {burial.biography && (
                <div>
                  <p className="text-xs mb-1" style={{ color: t.muted }}>Воспоминания</p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: t.accentText }}>{burial.biography}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Координаты — скрыты от гостей */}
        <div
          className="rounded-2xl p-6 border mb-8 flex items-center justify-between"
          style={{ background: t.surface2, borderColor: t.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: t.surface }}
            >
              <MapPin size={18} style={{ color: t.accent }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: t.accentText }}>Координаты захоронения</p>
              <p className="text-xs" style={{ color: t.muted }}>
                Войдите чтобы увидеть точное местоположение и построить маршрут
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium transition-opacity hover:opacity-90"
            style={{ background: t.accent, color: "white" }}
          >
            <Lock size={13} />
            Войти
          </Link>
        </div>

        {/* Сбор средств */}
        {fundraiser ? (
          <div className="rounded-2xl p-6 border mb-8" style={{ background: t.surface2, borderColor: t.border }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Coins size={16} style={{ color: t.accent }} />
                <span className="text-xs font-mono" style={{ color: t.muted }}>Сбор средств</span>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: fundraiser.status === "active" ? t.accent : t.surface,
                  color: fundraiser.status === "active" ? "#fff" : t.muted,
                }}
              >
                {fundraiser.status === "active" ? "Активен" : "Завершён"}
              </span>
            </div>

            <h3 className="font-semibold mb-1" style={{ color: t.accentText }}>{fundraiser.title}</h3>
            {fundraiser.description && (
              <p className="text-sm mb-4" style={{ color: t.muted }}>{fundraiser.description}</p>
            )}

            {/* Прогресс */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-2" style={{ color: t.muted }}>
                <span>Собрано: <strong style={{ color: t.accentText }}>{fundraiser.collected_amount.toLocaleString("ru-RU")} ₽</strong></span>
                <span>Цель: {fundraiser.goal_amount.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="w-full rounded-full h-2.5" style={{ background: t.surface }}>
                <div
                  className="h-2.5 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((fundraiser.collected_amount / fundraiser.goal_amount) * 100))}%`,
                    background: t.accent,
                  }}
                />
              </div>
              <div className="text-xs mt-1.5 text-right font-medium" style={{ color: t.accent }}>
                {Math.min(100, Math.round((fundraiser.collected_amount / fundraiser.goal_amount) * 100))}%
              </div>
            </div>

            {fundraiser.status === "active" && (
              <Link
                href={`/burial/${id}/donate`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: t.accent, color: "#fff" }}
              >
                <Coins size={15} />
                Пожертвовать
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-2xl p-6 border mb-8 flex items-center justify-between" style={{ background: t.surface2, borderColor: t.border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.surface }}>
                <Coins size={18} style={{ color: t.accent }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: t.accentText }}>Сбор средств</p>
                <p className="text-xs" style={{ color: t.muted }}>На памятник, уход или другие нужды</p>
              </div>
            </div>
            <Link
              href={`/burial/${id}/fundraiser/new`}
              className="text-sm px-4 py-2 rounded-full border font-medium transition-opacity hover:opacity-80"
              style={{ borderColor: t.border, color: t.accent }}
            >
              Открыть сбор
            </Link>
          </div>
        )}

        {/* Логотип агентства или платформы */}
        <div
          className="rounded-2xl p-6 border flex items-center justify-between"
          style={{ background: t.surface2, borderColor: t.border }}
        >
          {burial.agencies ? (
            <Link
              href={`/agency/${burial.agencies.id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border overflow-hidden"
                style={{ borderColor: t.border, background: t.surface }}
              >
                {burial.agencies.logo_url ? (
                  <img src={burial.agencies.logo_url} alt={burial.agencies.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs font-bold" style={{ color: t.accent }}>
                    {burial.agencies.name?.[0]}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs" style={{ color: t.muted }}>Запись внесена</p>
                <p className="text-sm font-medium" style={{ color: t.accentText }}>{burial.agencies.name}</p>
              </div>
              <ChevronRight size={16} style={{ color: t.muted }} />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: t.surface }}
              >
                <Heart size={18} style={{ color: t.accent }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: t.muted }}>Запись внесена</p>
                <p className="text-sm font-medium" style={{ color: t.accent }}>Помним про...</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
