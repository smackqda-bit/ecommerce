"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Breadcrumbs } from "@/components/ui";
import ProductCard from "@/components/ProductCard";
import { EASE, RouteLine } from "@/components/motion";
import { CATEGORIES, FABRICS, products } from "@/data/products";
import { pieces } from "@/lib/utils";

const SUGGEST = ["худи", "футболка", "кобальт", "шоппер", "графит"];

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е");

export default function SearchPage() {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);

  const results = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return [];
    return products.filter((p) => {
      const hay = norm([p.name, p.short, CATEGORIES.find((c) => c.id === p.category)?.label, ...p.variants.map((v) => FABRICS[v.color].name), p.idea].join(" "));
      return t.split(/\s+/).every((w) => hay.includes(w.slice(0, Math.max(3, w.length - 2))));
    });
  }, [q]);

  return (
    <main className="pb-24">
      <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Поиск" }]} />
      <div className="wrap flex flex-col gap-8 pt-10">
        <motion.label initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }} className="group relative flex items-center gap-4 border-b-2 border-ink pb-3">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden className="flex-none">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <span className="sr-only">Поиск по каталогу</span>
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Что ищем?"
            className="w-full bg-transparent text-[clamp(28px,4vw,56px)] font-bold outline-none placeholder:text-line-2"
          />
          {q && (
            <button onClick={() => setQ("")} className="flex-none text-[14px] text-mute hover:text-ink">
              Очистить
            </button>
          )}
        </motion.label>

        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className="mr-2 text-mute">{q ? (results.length ? `Нашлось ${pieces(results.length)}` : "") : "Часто ищут:"}</span>
          {!q &&
            SUGGEST.map((s, i) => (
              <motion.button key={s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: EASE }} onClick={() => setQ(s)} className="h-9 border border-line-2 px-3.5 transition-colors hover:border-ink">
                {s}
              </motion.button>
            ))}
        </div>

        <AnimatePresence mode="wait">
          {q && results.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-20 text-center">
              <RouteLine d="M8 50 C 40 10, 70 60, 100 18" viewBox="0 0 120 60" className="h-[60px] w-[120px] text-ink" start={[8, 50]} duration={1.4} />
              <h2 className="text-[22px] font-bold">По запросу «{q}» ничего</h2>
              <p className="text-mute">Попробуйте «худи», «футболка» или цвет — «графит».</p>
            </motion.div>
          ) : (
            <motion.div key="grid" layout className="grid grid-cols-2 gap-x-3 gap-y-9 md:gap-x-4 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {(q ? results : products.slice(0, 4)).map((p, i) => (
                  <motion.div key={p.slug} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.7, delay: i * 0.04, ease: EASE }}>
                    <ProductCard p={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
