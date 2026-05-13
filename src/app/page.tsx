import { Search, Plus, MapPin, Users, Heart, ChevronRight, FileText, Building2, PiggyBank } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import MapWrapper from "@/components/MapWrapper";

export default async function Home() {
  const { data: burials } = await supabase
    .from("burials")
    .select("id, full_name, lat, lng, birth_date, death_date")
    .eq("status", "published")
    .not("lat", "is", null)
    .not("lng", "is", null);

  const mapBurials = burials || [];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#4E6B55", color: "#1B3A2D" }}>

      {/* ── Навигация ── */}
      <header className="sticky top-0 z-50" style={{ background: "rgba(61,107,82,0.97)", backdropFilter: "blur(8px)" }}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between" style={{ height: 56 }}>
          <div className="flex items-center gap-2">
            <Heart size={16} style={{ color: "#D4B896" }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#D4B896" }}>Помним про...</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
            <Link href="/about" className="hover:text-white transition-colors">О проекте</Link>
            <Link href="/search" className="hover:text-white transition-colors">Поиск</Link>
            <Link href="/agencies" className="hover:text-white transition-colors">Агентства</Link>
            <Link href="/support" className="hover:text-white transition-colors">Поддержка</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}>Войти</Link>
            <Link href="/create" className="text-xs px-4 py-2 rounded-full flex items-center gap-1.5 font-medium hover:opacity-90 transition-opacity" style={{ background: "#D4B896", color: "#2A3D2E" }}>
              <Plus size={12} />Создать запись
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════
          HERO — диагональный split
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "calc(90vh - 56px)" }}>

        {/* Правый фон — коричневый */}
        <div className="absolute inset-0" style={{ background: "#7B4F2E" }} />

        {/* Фото листьев — правая панель */}
        <img
          src="/leaf1.jpg" alt=""
          className="absolute object-cover pointer-events-none"
          style={{ right: 0, top: 0, width: "65%", height: "100%", opacity: 0.85 }}
        />
        <img
          src="/leaf3.jpg" alt=""
          className="absolute object-cover pointer-events-none"
          style={{ right: "15%", bottom: "-5%", width: "40%", height: "50%", opacity: 0.55, mixBlendMode: "multiply" }}
        />

        {/* Зелёная трапеция — левая панель */}
        <div
          className="absolute inset-y-0 left-0 flex items-center"
          style={{
            width: "100%",
            clipPath: "polygon(0 0, 52% 0, 38% 100%, 0 100%)",
            background: "#3D6B52",
          }}
        />

        {/* Точечная текстура поверх зелёной зоны */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: "polygon(0 0, 52% 0, 38% 100%, 0 100%)",
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Текст поверх зелёной зоны */}
        <div className="relative z-10 flex items-center h-full" style={{ minHeight: "calc(90vh - 56px)", paddingLeft: "max(32px, calc((100vw - 1280px)/2 + 32px))" }}>
          <div style={{ maxWidth: 400 }}>
            <div
              className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-8 border"
              style={{ borderColor: "rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.72)", background: "rgba(255,255,255,0.09)" }}
            >
              <MapPin size={10} />Архангельская область
            </div>

            <h1
              className="leading-tight mb-5"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2.4rem, 4.2vw, 3.8rem)",
                fontWeight: 800,
                fontStyle: "italic",
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              Они живы,<br />
              <span style={{ color: "#D4B896", fontStyle: "normal", fontWeight: 700 }}>пока мы помним</span>
            </h1>

            <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.58)", maxWidth: 310 }}>
              Платформа для сохранения памяти о близких. Мемориальные страницы, карта захоронений и сборы средств.
            </p>

            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ background: "#D4B896", color: "#2A3D2E", letterSpacing: "0.01em" }}
            >
              Найти захоронение
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          СЕКЦИЯ «КАК ЭТО РАБОТАЕТ»
          Одна большая тёмная карточка
      ══════════════════════════════════ */}
      <section style={{ background: "#4E6B55", padding: "56px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          {/* Большая единая карточка */}
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ background: "#2A5040", borderRadius: 32, overflow: "hidden" }}
          >
            {[
              { icon: <FileText size={20} />,   title: "Страница памяти",    desc: "Создайте мемориальную страницу с фото, датами и историей жизни" },
              { icon: <MapPin size={20} />,      title: "Карта захоронений",  desc: "Найдите место на интерактивной карте и постройте маршрут" },
              { icon: <Building2 size={20} />,   title: "Агентства",          desc: "Ритуальные агентства оказывают услуги по уходу за захоронением" },
              { icon: <PiggyBank size={20} />,   title: "Сбор средств",       desc: "Откройте сбор с эскроу — деньги защищены до выполнения работ" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-5 p-7"
                style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
              >
                {/* Иконка в тонком круге — точно как в референсе */}
                <div
                  style={{
                    width: 50, height: 50, borderRadius: "50%",
                    border: "1.5px solid rgba(255,255,255,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>{item.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "#fff" }}>{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          КАРТОЧКИ — 2 ряда × 3
      ══════════════════════════════════ */}
      <section style={{ background: "#4E6B55", paddingBottom: 56 }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col gap-4">

          {/* Ряд 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Зелёная */}
            <div className="rounded-[28px] p-8 flex flex-col" style={{ background: "#5A9060", aspectRatio: "1/1" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-auto" style={{ background: "rgba(255,255,255,0.2)" }}>
                <Heart size={22} style={{ color: "#fff" }} />
              </div>
              <div className="mt-8">
                <p className="text-base font-bold mb-1.5" style={{ color: "#fff" }}>Страница памяти</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Бесплатно. Фото, биография, GPS-координаты.
                </p>
              </div>
            </div>

            {/* Тёмно-коричневая */}
            <div className="rounded-[28px] p-8 flex flex-col" style={{ background: "#3A2218", aspectRatio: "1/1" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-auto" style={{ background: "rgba(255,255,255,0.1)" }}>
                <Users size={22} style={{ color: "rgba(255,255,255,0.8)" }} />
              </div>
              <div className="mt-8">
                <p className="text-base font-bold mb-1.5" style={{ color: "#fff" }}>Агентства</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  32 ритуальных агентства, магазины и услуги по уходу.
                </p>
              </div>
            </div>

            {/* Тёплая коричневая */}
            <div className="rounded-[28px] p-8 flex flex-col" style={{ background: "#9B6A3A", aspectRatio: "1/1" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-auto" style={{ background: "rgba(255,255,255,0.15)" }}>
                <MapPin size={22} style={{ color: "#D4B896" }} />
              </div>
              <div className="mt-8">
                <p className="text-base font-bold mb-1.5" style={{ color: "#fff" }}>Карта</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  1 248 захоронений с GPS на интерактивной карте.
                </p>
              </div>
            </div>
          </div>

          {/* Ряд 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Фото природы */}
            <div className="rounded-[28px] overflow-hidden" style={{ aspectRatio: "1/1" }}>
              <img src="/leaf2.jpg" alt="" className="w-full h-full object-cover" />
            </div>

            {/* Тёмная с цветком */}
            <div className="rounded-[28px] p-8 flex flex-col" style={{ background: "#2D4035", aspectRatio: "1/1" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-auto" style={{ background: "rgba(255,255,255,0.1)" }}>
                <PiggyBank size={22} style={{ color: "rgba(255,255,255,0.8)" }} />
              </div>
              <div className="mt-8">
                <p className="text-base font-bold mb-1.5" style={{ color: "#fff" }}>Сбор средств</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Краудфандинг с эскроу — деньги защищены до выполнения работ.
                </p>
              </div>
            </div>

            {/* Светлая песочная */}
            <div className="rounded-[28px] p-8 flex flex-col" style={{ background: "#C4A875", aspectRatio: "1/1" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-auto" style={{ background: "rgba(255,255,255,0.25)" }}>
                <Search size={22} style={{ color: "#3A2218" }} />
              </div>
              <div className="mt-8">
                <p className="text-base font-bold mb-1.5" style={{ color: "#3A2218" }}>Поиск</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(58,34,24,0.55)" }}>
                  Найдите захоронение по имени, региону или вероисповеданию.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════
          КАРТА ЗАХОРОНЕНИЙ
      ══════════════════════════════════ */}
      <section style={{ background: "#3D5A46", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-5xl mx-auto px-6 py-14 w-full">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-xs font-mono mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>01</p>
              <h2 className="text-xl font-bold" style={{ color: "#fff" }}>Карта захоронений</h2>
            </div>
            <Link href="/map" className="text-xs flex items-center gap-1 font-medium hover:gap-2 transition-all" style={{ color: "#D4B896" }}>
              Открыть карту <ChevronRight size={13} />
            </Link>
          </div>
          <div className="w-full rounded-[28px] overflow-hidden" style={{ height: "420px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <MapWrapper burials={mapBurials} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          ПОИСК
      ══════════════════════════════════ */}
      <section style={{ background: "#3D5A46", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="relative max-w-xl">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }} />
            <input
              type="text"
              placeholder="Поиск по имени, фамилии, датам рождения..."
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          ФУТЕР
      ══════════════════════════════════ */}
      <footer style={{ background: "#2A3D2E", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-5xl mx-auto px-6 py-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <Heart size={13} style={{ color: "#D4B896" }} />
            <span className="text-xs font-semibold" style={{ color: "#D4B896" }}>Помним про...</span>
          </div>
          <div className="flex items-center gap-6 text-xs flex-wrap" style={{ color: "rgba(255,255,255,0.35)" }}>
            <Link href="/about" className="hover:text-white transition-colors">О проекте</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Конфиденциальность</Link>
            <Link href="/support" className="hover:text-white transition-colors">Поддержка</Link>
            <Link href="/agreement" className="hover:text-white transition-colors">Соглашение</Link>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>© 2024 ООО «Северный центр позитроники»</p>
        </div>
      </footer>

    </div>
  );
}
