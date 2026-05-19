import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.stage}>
        <div className={styles.scene}>
          <div className={styles.photoBg} />
          <div className={styles.photoOverlay} />
        </div>

        <div className={styles.layer}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <Link href="/" className={`${styles.pill} ${styles.brand}`}>
                <span className={styles.mark}>Помнимпро</span>
                <span className={styles.sub}>ИНТЕРАКТИВНАЯ ПОИСКОВАЯ СИСТЕМА ЗАХОРОНЕНИЙ</span>
              </Link>
              <Link href="/about" className={styles.pill}>О проекте</Link>
              <Link href="/search" className={styles.pill}>Книга записей</Link>
            </div>
            <div className={styles.topbarRight}>
              <Link href="/about#how" className={styles.pill}>Как это устроено</Link>
              <Link href="/search" className={styles.pill}>Поиск</Link>
              <Link href="/login" className={styles.pill}>Войти</Link>
              <Link href="/create" className={styles.pill}>+ Внести запись</Link>
            </div>
          </header>

          <section className={styles.center}>
            <div className={styles.actions}>
              <Link href="/create" className={`${styles.btn} ${styles.solid}`}>Внести запись</Link>
              <div className={styles.basketSpacer} />
              <Link href="/search" className={`${styles.btn} ${styles.solid}`}>Найти запись</Link>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footWrap}>
          <div className={styles.footBrand}>
            <span className={styles.it}>Помнимпро</span>
          </div>
          <nav className={styles.footLinks}>
            <Link href="/about">О проекте</Link>
            <Link href="/search">Книга записей</Link>
            <Link href="/search">Поиск</Link>
            <Link href="/support">Поддержка</Link>
            <Link href="/agreement">Соглашение</Link>
            <Link href="/privacy">Конфиденциальность</Link>
          </nav>
          <div className={styles.footMeta}>
            <span>© 2025–2026</span>
            <span className={styles.sep} />
            <span>pomnimpro.ru</span>
            <span className={styles.sep} />
            <span>ce2.ru</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
