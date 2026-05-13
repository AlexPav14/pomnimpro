"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Heart, ArrowRight, ArrowLeft, Upload, MapPin, User, Calendar } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import PhotoUpload from "@/components/PhotoUpload";

const STEPS = ["Личные данные", "Биография", "Место захоронения", "Фото и описание"];

export default function EditBurialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    birth_date: "",
    death_date: "",
    birth_place: "",
    religion: "",
    education: "",
    military_service: "",
    occupation: "",
    biography: "",
    region: "",
    cemetery_name: "",
    lat: "",
    lng: "",
    photo_main_url: "",
    photo_general_url: "",
  });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: burial, error } = await supabase
        .from("burials")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !burial) { router.push("/profile"); return; }
      if (burial.created_by !== user.id) { router.push("/profile"); return; }

      setForm({
        full_name: burial.full_name || "",
        birth_date: burial.birth_date || "",
        death_date: burial.death_date || "",
        birth_place: burial.birth_place || "",
        religion: burial.religion || "",
        education: burial.education || "",
        military_service: burial.military_service || "",
        occupation: burial.occupation || "",
        biography: burial.biography || "",
        region: burial.region || "",
        cemetery_name: burial.cemetery_name || "",
        lat: burial.lat != null ? String(burial.lat) : "",
        lng: burial.lng != null ? String(burial.lng) : "",
        photo_main_url: burial.photo_main_url || "",
        photo_general_url: burial.photo_general_url || "",
      });

      setInitialLoading(false);
    }
    load();
  }, [id, router]);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    setError("");
    if (step === 0) {
      if (!form.full_name) { setError("Введите ФИО"); return; }
      if (!form.birth_date) { setError("Укажите дату рождения"); return; }
      if (!form.death_date) { setError("Укажите дату смерти"); return; }
    }
    if (step === 2 && !form.region) {
      setError("Укажите регион");
      return;
    }
    setStep(s => s + 1);
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const { error } = await supabase
      .from("burials")
      .update({
        full_name: form.full_name,
        birth_date: form.birth_date || null,
        death_date: form.death_date || null,
        biography: form.biography || null,
        religion: form.religion || null,
        birth_place: form.birth_place || null,
        education: form.education || null,
        military_service: form.military_service || null,
        occupation: form.occupation || null,
        region: form.region,
        cemetery_name: form.cemetery_name || null,
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null,
        photo_main_url: form.photo_main_url || null,
        photo_general_url: form.photo_general_url || null,
      })
      .eq("id", id);

    if (error) {
      setError("Ошибка при сохранении. Попробуйте ещё раз.");
      setLoading(false);
      return;
    }

    router.push(`/burial/${id}`);
  }

  if (initialLoading) {
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
          <Link href={`/burial/${id}`} className="text-sm hover:opacity-70" style={{ color: "var(--muted)" }}>
            Отмена
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-xl mx-auto w-full px-6 py-12">

        {/* Заголовок */}
        <div className="mb-8">
          <div className="text-xs font-mono mb-1" style={{ color: "var(--muted)" }}>Редактирование</div>
          <h1 className="text-2xl font-bold">{form.full_name}</h1>
        </div>

        {/* Прогресс */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: i <= step ? "var(--accent)" : "var(--surface)",
                    color: i <= step ? "white" : "var(--muted)",
                    border: `1px solid ${i <= step ? "var(--accent)" : "var(--border)"}`
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-xs hidden sm:block" style={{ color: i === step ? "var(--foreground)" : "var(--muted)" }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px ml-2" style={{ background: i < step ? "var(--accent)" : "var(--border)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Шаг 1 — Личные данные */}
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User size={16} style={{ color: "var(--accent)" }} />
                <h2 className="text-xl font-bold">Личные данные</h2>
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Основная информация о человеке</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  ФИО <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => set("full_name", e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Вероисповедание</label>
                <select
                  value={form.religion}
                  onChange={e => set("religion", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: form.religion ? "var(--foreground)" : "var(--muted)" }}
                >
                  <option value="">Не указано</option>
                  <option value="Православие">Православие</option>
                  <option value="Католицизм">Католицизм</option>
                  <option value="Протестантизм">Протестантизм</option>
                  <option value="Ислам">Ислам</option>
                  <option value="Иудаизм">Иудаизм</option>
                  <option value="Буддизм">Буддизм</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                    <Calendar size={12} className="inline mr-1" />
                    Дата рождения <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.birth_date}
                    onChange={e => set("birth_date", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                    style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                    <Calendar size={12} className="inline mr-1" />
                    Дата смерти <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.death_date}
                    onChange={e => set("death_date", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                    style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 2 — Биография */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User size={16} style={{ color: "var(--accent)" }} />
                <h2 className="text-xl font-bold">Биография</h2>
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Жизненный путь человека</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Место рождения</label>
                <input
                  type="text"
                  value={form.birth_place}
                  onChange={e => set("birth_place", e.target.value)}
                  placeholder="г. Архангельск"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Образование</label>
                <select
                  value={["Школа","Среднее специальное","Высшее","Другое",""].includes(form.education) ? form.education : "другой"}
                  onChange={e => {
                    if (e.target.value !== "другой") set("education", e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value="">Не указано</option>
                  <option value="Школа">Школа</option>
                  <option value="Среднее специальное">Среднее специальное (техникум, колледж)</option>
                  <option value="Высшее">Высшее (ВУЗ)</option>
                  <option value="Другое">Другое</option>
                </select>
                <input
                  type="text"
                  value={form.education}
                  onChange={e => set("education", e.target.value)}
                  placeholder="Название учебного заведения (необязательно)"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Служба в армии</label>
                <input
                  type="text"
                  value={form.military_service}
                  onChange={e => set("military_service", e.target.value)}
                  placeholder="Например: в/ч 12345, 1965–1967"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Место работы / профессия</label>
                <input
                  type="text"
                  value={form.occupation}
                  onChange={e => set("occupation", e.target.value)}
                  placeholder="Завод Севмаш, инженер"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Воспоминания / биография</label>
                <textarea
                  value={form.biography}
                  onChange={e => set("biography", e.target.value)}
                  placeholder="Расскажите о человеке — его жизни, увлечениях, вкладе в жизни близких..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border resize-none"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Шаг 3 — Место захоронения */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} style={{ color: "var(--accent)" }} />
                <h2 className="text-xl font-bold">Место захоронения</h2>
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Координаты будут скрыты от незарегистрированных пользователей
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  Регион <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.region}
                  onChange={e => set("region", e.target.value)}
                  placeholder="Архангельская область"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Название кладбища</label>
                <input
                  type="text"
                  value={form.cemetery_name}
                  onChange={e => set("cemetery_name", e.target.value)}
                  placeholder="Северное кладбище"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                  style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div
                className="rounded-xl p-4 border"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
              >
                <p className="text-xs font-medium mb-3 flex items-center gap-1" style={{ color: "var(--muted)" }}>
                  <MapPin size={12} />
                  GPS координаты (скрыты от гостей)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs" style={{ color: "var(--muted)" }}>Широта</label>
                    <input
                      type="text"
                      value={form.lat}
                      onChange={e => set("lat", e.target.value)}
                      placeholder="64.5401"
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border"
                      style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs" style={{ color: "var(--muted)" }}>Долгота</label>
                    <input
                      type="text"
                      value={form.lng}
                      onChange={e => set("lng", e.target.value)}
                      placeholder="40.5182"
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border"
                      style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Шаг 4 — Фото */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Upload size={16} style={{ color: "var(--accent)" }} />
                <h2 className="text-xl font-bold">Фото</h2>
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Можно оставить без изменений или заменить</p>
            </div>

            <div className="flex flex-col gap-6">
              <PhotoUpload
                label="Основное фото — табличка с данными"
                hint="Крупный план таблички с ФИО и датами"
                value={form.photo_main_url}
                field="photo_main_url"
                onSet={set}
              />
              <PhotoUpload
                label="Второстепенное фото — общий вид захоронения"
                hint="Общий вид места захоронения"
                value={form.photo_general_url}
                field="photo_general_url"
                onSet={set}
              />
            </div>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <p className="text-sm text-red-500 mt-4">{error}</p>
        )}

        {/* Кнопки навигации */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm border transition-colors hover:bg-black hover:text-white"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <ArrowLeft size={16} />
              Назад
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "white" }}
            >
              Далее
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--accent)", color: "white" }}
            >
              {loading ? "Сохраняем..." : <>Сохранить изменения <ArrowRight size={16} /></>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
