"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Heart, Search, MapPin, Calendar, ChevronRight, X } from "lucide-react";

interface Burial {
  id: string;
  full_name: string;
  birth_date: string | null;
  death_date: string | null;
  region: string | null;
  cemetery_name: string | null;
  photo_main_url: string | null;
  religion: string | null;
}

const RELIGIONS = ["Православие", "Католицизм", "Протестантизм", "Ислам", "Иудаизм", "Буддизм", "Другое"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [religion, setReligion] = useState("");
  const [yearBirthFrom, setYearBirthFrom] = useState("");
  const [yearBirthTo, setYearBirthTo] = useState("");
  const [yearDeathFrom, setYearDeathFrom] = useState("");
  const [yearDeathTo, setYearDeathTo] = useState("");
  const [results, setResults] = useState<Burial[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setSearched(true);

    let q = supabase
      .from("burials")
      .select("id, full_name, birth_date, death_date, region, cemetery_name, photo_main_url, religion, birth_place, education, military_service, occupation")
      .eq("status", "published");

    if (query.trim()) {
      q = q.or(`full_name.ilike.%${query.trim()}%,birth_place.ilike.%${query.trim()}%,occupation.ilike.%${query.trim()}%,education.ilike.%${query.trim()}%,military_service.ilike.%${query.trim()}%,cemetery_name.ilike.%${query.trim()}%`);
    }
    if (region.trim()) q = q.ilike("region", `%${region.trim()}%`);
    if (religion) q = q.eq("religion", religion);
    if (yearBirthFrom) q = q.gte("birth_date", `${yearBirthFrom}-01-01`);
    if (yearBirthTo) q = q.lte("birth_date", `${yearBirthTo}-12-31`);
    if (yearDeathFrom) q = q.gte("death_date", `${yearDeathFrom}-01-01`);
    if (yearDeathTo) q = q.lte("death_date", `${yearDeathTo}-12-31`);

    const { data } = await q.limit(50).order("full_name");
    setResults(data || []);
    setLoading(false);
  }

  function clearFilters() {
    setQuery("");
    setRegion("");
    setReligion("");
    setYearBirthFrom("");
    setYearBirthTo("");
    setYearDeathFrom("");
    setYearDeathTo("");
    setResults([]);
    setSearched(false);
  }

  const hasFilters = query || region || religion || yearBirthFrom || yearBirthTo || yearDeathFrom || yearDeathTo;

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
          <Link
            href="/create"
            className="text-sm px-4 py-2 rounded-full font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "white" }}
          >
            + Создать запись
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto w-full px-6 py-10">

        <div className="mb-8">
          <div className="text-xs font-mono mb-2" style={{ color: "var(--muted)" }}>Книга записей</div>
          <h1 className="text-3xl font-bold">Поиск захоронений</h1>
        </div>

        {/* Форма поиска */}
        <div
          className="rounded-2xl p-6 border mb-8"
          style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
        >
          {/* ФИО */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Поиск по ФИО..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border"
              style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          {/* Регион + Вероисповедание */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                value={region}
                onChange={e => setRegion(e.target.value)}
                placeholder="Регион"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none border"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <select
              value={religion}
              onChange={e => setReligion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border"
              style={{ background: "var(--background)", borderColor: "var(--border)", color: religion ? "var(--foreground)" : "var(--muted)" }}
            >
              <option value="">Вероисповедание — любое</option>
              {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Даты рождения */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: "var(--muted)" }}>Рождение от</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input
                  type="number"
                  value={yearBirthFrom}
                  onChange={e => setYearBirthFrom(e.target.value)}
                  placeholder="1900"
                  min="1850" max="2024"
                  className="w-full pl-8 pr-2 py-2.5 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: "var(--muted)" }}>Рождение до</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input
                  type="number"
                  value={yearBirthTo}
                  onChange={e => setYearBirthTo(e.target.value)}
                  placeholder="2000"
                  min="1850" max="2024"
                  className="w-full pl-8 pr-2 py-2.5 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: "var(--muted)" }}>Смерть от</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input
                  type="number"
                  value={yearDeathFrom}
                  onChange={e => setYearDeathFrom(e.target.value)}
                  placeholder="1950"
                  min="1850" max="2024"
                  className="w-full pl-8 pr-2 py-2.5 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: "var(--muted)" }}>Смерть до</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input
                  type="number"
                  value={yearDeathTo}
                  onChange={e => setYearDeathTo(e.target.value)}
                  placeholder="2024"
                  min="1850" max="2024"
                  className="w-full pl-8 pr-2 py-2.5 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--accent)", color: "white" }}
            >
              <Search size={14} />
              {loading ? "Ищем..." : "Найти"}
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
                style={{ color: "var(--muted)" }}
              >
                <X size={14} />
                Сбросить
              </button>
            )}
          </div>
        </div>

        {/* Результаты */}
        {searched && (
          <div>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              {loading ? "Поиск..." : `Найдено: ${results.length}`}
            </p>

            {results.length === 0 && !loading && (
              <div
                className="rounded-2xl p-12 border text-center"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
              >
                <Search size={32} className="mx-auto mb-3" style={{ color: "var(--border)" }} />
                <p className="text-sm font-medium mb-1">Ничего не найдено</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Попробуйте изменить параметры поиска</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {results.map(burial => {
                const birthYear = burial.birth_date ? new Date(burial.birth_date).getFullYear() : null;
                const deathYear = burial.death_date ? new Date(burial.death_date).getFullYear() : null;
                const years = birthYear && deathYear
                  ? `${birthYear} – ${deathYear}`
                  : birthYear ? `р. ${birthYear}`
                  : deathYear ? `† ${deathYear}` : null;

                return (
                  <Link
                    key={burial.id}
                    href={`/burial/${burial.id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm"
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
                        {burial.religion && (
                          <span className="text-xs px-2 py-0.5 rounded-full border" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
                            {burial.religion}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight size={16} style={{ color: "var(--muted)" }} className="flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
