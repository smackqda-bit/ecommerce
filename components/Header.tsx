"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useCartCount, useFavCount, useStore, useHydrated } from "@/lib/store";
import { RollingNumber, EASE } from "./motion";
import { useScrollLock } from "./SmoothScroll";

export const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О бренде" },
  { href: "/help", label: "Помощь" },
  { href: "/contacts", label: "Контакты" },
];

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link href="/" className={clsx("group flex items-center gap-2.5 text-[17px] font-extrabold tracking-[0.3em] sm:text-[18px]", light ? "text-milk" : "text-ink")} aria-label="ВНЕ ПЛАНА — на главную">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="overflow-visible">
        <circle cx="5" cy="19" r="3" fill="#1E3FCC" />
        <path
          d="M5 19 C 5 8, 19 16, 19 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeDasharray="2 3"
          className="transition-[stroke-dashoffset] duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:[stroke-dashoffset:-20]"
        />
        <circle cx="19" cy="5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" className="origin-[19px_5px] transition-transform duration-500 group-hover:scale-125" />
      </svg>
      ВНЕ ПЛАНА
    </Link>
  );
}

const IconBtn = "relative flex h-11 min-w-11 items-center justify-center gap-1 px-2 text-[13px] font-semibold text-ink transition-colors duration-300 hover:text-cobalt";

export default function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const cart = useCartCount();
  const favs = useFavCount();
  const user = useStore((s) => s.user);
  const hydrated = useHydrated();
  useScrollLock(menu);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    setHidden(y > 160 && y > prev && !menu);
  });

  useEffect(() => setMenu(false), [pathname]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        className={clsx(
          "wrap sticky top-0 z-40 flex items-center justify-between gap-4 border-b py-3.5 transition-[background-color,border-color] duration-500",
          scrolled ? "border-line bg-milk/85 backdrop-blur-md" : "border-line bg-milk"
        )}
      >
        <div className="flex items-center gap-2">
          <button className={clsx(IconBtn, "-ml-2 md:hidden")} aria-label={menu ? "Закрыть меню" : "Открыть меню"} aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <span className="relative block h-3 w-5">
              <span className={clsx("absolute left-0 top-0 h-[1.6px] w-5 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]", menu && "translate-y-[5px] rotate-45")} />
              <span className={clsx("absolute bottom-0 left-0 h-[1.6px] w-5 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]", menu && "-translate-y-[5.5px] -rotate-45")} />
            </span>
          </button>
          <Logo />
        </div>

        <nav aria-label="Основное меню" className="hidden gap-7 text-[14px] font-medium md:flex">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={clsx("relative py-1 transition-colors duration-300 hover:text-cobalt", active && "text-cobalt")}>
                {n.label}
                {active && <motion.span layoutId="nav-dot" className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cobalt" transition={{ duration: 0.6, ease: EASE }} />}
              </Link>
            );
          })}
        </nav>

        <div className="-mr-2 flex items-center">
          <Link href="/search" aria-label="Поиск" className={IconBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          </Link>
          <Link href="/favorites" aria-label={`Избранное, ${favs}`} className={clsx(IconBtn, "hidden sm:flex")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
            {favs > 0 && <RollingNumber value={favs} />}
          </Link>
          <Link href={hydrated && user ? "/account" : "/login"} aria-label="Личный кабинет" className={clsx(IconBtn, "hidden sm:flex")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></svg>
          </Link>
          <Link href="/cart" aria-label={`Корзина, ${cart}`} className={clsx(IconBtn, pathname === "/cart" && "text-cobalt")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            <RollingNumber value={cart} />
          </Link>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 top-[69px] z-30 flex flex-col bg-milk md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
            data-lenis-prevent
          >
            <nav aria-label="Мобильное меню" className="wrap flex flex-col pt-8">
              {[...NAV, { href: "/favorites", label: "Избранное" }, { href: hydrated && user ? "/account" : "/login", label: "Личный кабинет" }].map((n, i) => (
                <motion.div key={n.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 + i * 0.05, ease: EASE }}>
                  <Link href={n.href} className="flex items-center justify-between border-b border-line py-4 text-[28px] font-bold">
                    {n.label}
                    <span className="text-[18px] text-faint">→</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div className="wrap mt-auto flex items-center gap-2.5 pb-10 font-mono text-[12px] tracking-[0.14em] text-mute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <span className="pulse-dot h-2 w-2 rounded-full bg-cobalt" /> КАПСУЛА 01 · МАРШРУТ НЕ ПОСТРОЕН
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
