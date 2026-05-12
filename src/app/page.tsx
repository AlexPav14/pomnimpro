import { Search, Plus, MapPin, Users, Heart, ArrowRight, ChevronRight } from "lucide-react";
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
    <div className="flex flex-col min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>

      {/* Навигация */}
      <header style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={18} style={{ color: "var(--accent-gold)" }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>
              Помним про...
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--muted)" }}>
            <Link href="/about" className="hover:text-black transition-colors">О проекте</Link>
            <Link href="/search" className="hover:text-black transition-colors">Поиск</Link>
            <Link href="/agencies" className="hover:text-black transition-colors">Агентства</Link>
            <Link href="/support" className="hover:text-black transition-colors">Поддержка</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm transition-colors hover:text-black" style={{ color: "var(--muted)" }}>
              Войти
            </Link>
            <Link
              href="/create"
              className="text-sm px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "white" }}
            >
              <Plus size={14} />
              Создать запись
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full mb-8 border"
              style={{ borderColor: "var(--border)", color: "var(--muted)", background: "var(--surface-2)" }}
            >
              <MapPin size={12} style={{ color: "var(--accent)" }} />
              Архангельская область
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
              Они живы,<br />
              <span style={{ color: "var(--accent-gold)" }}>пока мы помним</span>
            </h1>
            <p className="text-lg max-w-md" style={{ color: "var(--muted)" }}>
              Платформа для сохранения памяти о близких. Мемориальные страницы, карта захоронений и сборы средств.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link
              href="/create"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "white" }}
            >
              Создать страницу памяти
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm border transition-colors hover:bg-black hover:text-white"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              Найти захоронение
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Поиск */}
      <section className="max-w-7xl mx-auto px-6 pb-16 w-full">
        <div className="relative max-w-2xl">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Поиск по имени, фамилии, датам рождения..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all border"
            style={{
              background: "var(--surface-2)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
      </section>

      {/* Разделитель */}
      <div style={{ borderTop: "1px solid var(--border)" }} />

      {/* Карта */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-mono mb-2" style={{ color: "var(--muted)" }}>01</div>
            <h2 className="text-2xl font-bold">Карта захоронений</h2>
          </div>
          <Link
            href="/map"
            className="text-sm flex items-center gap-1 hover:gap-2 transition-all"
            style={{ color: "var(--accent)" }}
          >
            Открыть карту <ChevronRight size={14} />
          </Link>
        </div>

        <div className="w-full rounded-2xl overflow-hidden" style={{ height: "460px", border: "1px solid var(--border)" }}>
          <MapWrapper burials={mapBurials} />
        </div>
      </section>

      {/* Разделитель */}
      <div style={{ borderTop: "1px solid var(--border)" }} />

      {/* Статистика */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "var(--border)" }}>
          {[
            { value: "1 248", label: "Захоронений в базе", icon: <MapPin size={20} /> },
            { value: "32", label: "Ритуальных агентства", icon: <Users size={20} /> },
            { value: "4 900", label: "Человек хранят память", icon: <Heart size={20} /> },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-4 p-10" style={{ background: "var(--background)" }}>
              <div style={{ color: "var(--accent)" }}>{stat.icon}</div>
              <div className="text-4xl font-bold" style={{ color: "var(--accent-gold)" }}>{stat.value}</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Разделитель */}
      <div style={{ borderTop: "1px solid var(--border)" }} />

      {/* Как это работает */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="mb-12">
          <div className="text-xs font-mono mb-2" style={{ color: "var(--muted)" }}>02</div>
          <h2 className="text-2xl font-bold">Как это работает</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Создайте страницу памяти",
              desc: "Внесите данные о захоронении — имя, даты, фото, координаты. Это бесплатно для всех пользователей."
            },
            {
              step: "02",
              title: "Поделитесь с близкими",
              desc: "Отправьте ссылку родственникам и друзьям. Они смогут найти страницу на карте или через поиск."
            },
            {
              step: "03",
              title: "Откройте сбор средств",
              desc: "Соберите деньги на памятник или уход через встроенную систему с эскроу и фотоотчётом."
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border flex flex-col gap-4"
              style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
            >
              <div className="text-xs font-mono" style={{ color: "var(--muted)" }}>{item.step}</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Футер */}
      <footer className="mt-auto" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Heart size={14} style={{ color: "var(--accent-gold)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Помним про...</span>
          </div>
          <div className="flex items-center gap-6 text-sm flex-wrap" style={{ color: "var(--muted)" }}>
            <Link href="/about" className="hover:text-black transition-colors">О проекте</Link>
            <Link href="/privacy" className="hover:text-black transition-colors">Конфиденциальность</Link>
            <Link href="/support" className="hover:text-black transition-colors">Поддержка</Link>
            <Link href="/agreement" className="hover:text-black transition-colors">Соглашение</Link>
          </div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>© 2024 ООО «Северный центр позитроники»</p>
        </div>
      </footer>

    </div>
  );
}
