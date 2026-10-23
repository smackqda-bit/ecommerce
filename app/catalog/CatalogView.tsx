"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { CATEGORIES, FABRICS, products, type ColorId, type Size } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Drawer } from "@/components/Overlay";
import { Breadcrumbs, Button } from "@/components/ui";
import { EASE, LineReveal, RouteLine } from "@/components/motion";
import { combos, models, LAST_CATALOG_KEY } from "@/lib/utils";

const SIZES: Size[] = ["S", "M", "L", "XL"];
const SORTS = [
  { id: "collection", label: "По коллекции" },
  { id: "asc", label: "Сначала дешевле" },
  { id: "desc", label: "Сначала дороже" },
];

type F = { cat: string; sizes: string[]; colors: string[]; min: string; max: string; stock: boolean; sort: string };

function parse(sp: URLSearchParams): F {
  return {
    cat: sp.get("cat") ?? "all",
    sizes: sp.get("size")?.split(",").filter(Boolean) ?? [],
    colors: sp.get("color")?.split(",").filter(Boolean) ?? [],
    min: sp.get("min") ?? "",
    max: sp.get("max") ?? "",
    stock: sp.get("stock") === "1",
    sort: sp.get("sort") ?? "collection",
  };
}

function toQuery(f: F) {
  const q = new URLSearchParams();
  if (f.cat !== "all") q.set("cat", f.cat);
  if (f.sizes.length) q.set("size", f.sizes.join(","));
  if (f.colors.length) q.set("color", f.colors.join(","));
  if (f.min) q.set("min", f.min);
  if (f.max) q.set("max", f.max);
  if (f.stock) q.set("stock", "1");
  if (f.sort !== "collection") q.set("sort", f.sort);
  const s = q.toString();
  return s ? `?${s}` : "";
}

function filterProducts(f: F) {
  let list = products.filter((p) => {
    if (f.cat !== "all" && p.category !== f.cat) return false;
    if (f.sizes.length && !p.sizes.some((s) => f.sizes.includes(s)) && !p.sizes.includes("ONE")) return false;
    if (f.colors.length && !p.variants.some((v) => f.colors.includes(v.color))) return false;
    if (f.min && p.price < Number(f.min)) return false;
    if (f.max && p.price > Number(f.max)) return false;
    if (f.stock && p.soldOut) return false;
    return true;
  });
  if (f.sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
  if (f.sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function CatalogView() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const f = useMemo(() => parse(new URLSearchParams(sp.toString())), [sp]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<F>(f);

  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_CATALOG_KEY, pathname + toQuery(f));
    } catch {}
  }, [f, pathname]);

  const apply = (next: F) => router.replace(pathname + toQuery(next), { scroll: false });
  const list = filterProducts(f);
  const draftCount = filterProducts(draft).length;
  const variantCount = list.reduce((n, p) => n + p.variants.length, 0);

  const applied = [
    ...f.sizes.map((s) => ({ label: s, remove: () => apply({ ...f, sizes: f.sizes.filter((x) => x !== s) }) })),
    ...f.colors.map((c) => ({ label: FABRICS[c as ColorId]?.name ?? c, remove: () => apply({ ...f, colors: f.colors.filter((x) => x !== c) }) })),
    ...(f.min || f.max ? [{ label: `${f.min || 0}–${f.max || "∞"} ₽`, remove: () => apply({ ...f, min: "", max: "" }) }] : []),
    ...(f.stock ? [{ label: "В наличии", remove: () => apply({ ...f, stock: false }) }] : []),
  ];
  const resetAll = () => apply({ ...f, sizes: [], colors: [], min: "", max: "", stock: false });

  const openFilters = () => {
    setDraft(f);
    setOpen(true);
  };

  return (
    <main className="pb-24">
      <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Каталог" }]} />
      <section className="wrap flex flex-col gap-6 pb-6 pt-7">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <LineReveal as="h1" immediate lines={["Каталог"]} className="text-[clamp(36px,4.4vw,60px)] font-extrabold tracking-[0.02em]" />
          <motion.span className="font-mono text-[13px] text-mute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
            КАПСУЛА 01 «МАРШРУТ НЕ ПОСТРОЕН» · {list.length ? `${models(list.length)} · ${combos(variantCount)}` : "0 вещей"}
          </motion.span>
        </div>

        <div role="group" aria-label="Категории" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {CATEGORIES.map((c) => {
            const on = f.cat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => apply({ ...f, cat: c.id })}
                aria-pressed={on}
                className={clsx("relative h-10 shrink-0 border border-ink px-[18px] text-[13px] font-medium transition-colors duration-500", on ? "text-milk" : "text-ink hover:bg-sand")}
              >
                {on && <motion.span layoutId="chip" className="absolute inset-0 bg-ink" transition={{ duration: 0.6, ease: EASE }} />}
                <span className="relative">{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={openFilters} className="group flex h-10 items-center gap-2 bg-ink px-4 text-[13px] font-semibold text-milk transition-colors duration-500 hover:bg-cobalt">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
                <circle cx="16" cy="7" r="2" className="transition-transform duration-500 group-hover:-translate-x-1" />
                <circle cx="10" cy="17" r="2" className="transition-transform duration-500 group-hover:translate-x-1" />
              </svg>
              Фильтры{applied.length ? ` · ${applied.length}` : ""}
            </button>
            <AnimatePresence initial={false}>
              {applied.map((a) => (
                <motion.button
                  key={a.label}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  onClick={a.remove}
                  aria-label={`Убрать фильтр ${a.label}`}
                  className="flex h-10 items-center gap-2 border border-line-2 px-3 text-[13px] transition-colors hover:border-ink"
                >
                  {a.label}
                  <span aria-hidden>✕</span>
                </motion.button>
              ))}
            </AnimatePresence>
            {applied.length > 0 && (
              <button onClick={resetAll} className="link-line-on h-10 px-2 text-[13px]">
                Сбросить все
              </button>
            )}
          </div>
          <label className="flex items-center gap-2 text-[13px]">
            Сортировка
            <select value={f.sort} onChange={(e) => apply({ ...f, sort: e.target.value })} className="h-10 border border-line-2 bg-transparent px-2.5 text-[13px] text-ink outline-none focus:border-ink">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="wrap">
        {list.length ? (
          <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-9 md:gap-x-4 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.9, delay: i * 0.05, ease: EASE }}
                >
                  <ProductCard p={p} priority={i < 4} initialColor={(f.colors.find((c) => p.variants.some((v) => v.color === c)) as ColorId) ?? undefined} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-28 text-center">
            <RouteLine d="M8 50 C 40 10, 70 60, 100 18" viewBox="0 0 120 60" className="h-[60px] w-[120px] text-ink" start={[8, 50]} duration={1.4} />
            <h2 className="text-[24px] font-bold">Тут маршрут обрывается</h2>
            <p className="text-[15px] text-mute">По этим фильтрам ничего не нашлось.</p>
            <Button onClick={() => apply({ ...f, cat: "all", sizes: [], colors: [], min: "", max: "", stock: false })}>Сбросить параметры</Button>
          </motion.div>
        )}
        {list.length > 0 && (
          <p className="mt-16 text-center font-mono text-[12px] tracking-[0.14em] text-faint">
            ПОКАЗАНО {list.length} ИЗ {products.length} · КОНЕЦ МАРШРУТА
          </p>
        )}
      </section>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Фильтры"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setDraft({ ...draft, sizes: [], colors: [], min: "", max: "", stock: false })}>
              Сбросить
            </Button>
            <Button
              className="flex-[2]"
              onClick={() => {
                apply(draft);
                setOpen(false);
              }}
            >
              Показать {draftCount ? models(draftCount) : "0"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-8">
          <fieldset>
            <legend className="mb-3 text-[14px] font-bold">Размер</legend>
            <div className="flex gap-1.5">
              {SIZES.map((s) => {
                const on = draft.sizes.includes(s);
                return (
                  <button
                    key={s}
                    aria-pressed={on}
                    onClick={() => setDraft({ ...draft, sizes: toggle(draft.sizes, s) })}
                    className={clsx("h-11 w-[54px] border text-[14px] font-semibold transition-colors duration-300", on ? "border-ink bg-ink text-milk" : "border-line-2 hover:border-ink")}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-1">
            <legend className="mb-3 text-[14px] font-bold">Цвет</legend>
            {(Object.keys(FABRICS) as ColorId[]).map((c) => (
              <label key={c} className="flex h-11 cursor-pointer items-center gap-3 text-[14px]">
                <input type="checkbox" checked={draft.colors.includes(c)} onChange={() => setDraft({ ...draft, colors: toggle(draft.colors, c) })} className="h-[18px] w-[18px] accent-ink" />
                <span className="h-3.5 w-3.5 rounded-full shadow-[0_0_0_1px_var(--color-line-2)]" style={{ background: FABRICS[c].hex }} />
                {FABRICS[c].name}
              </label>
            ))}
          </fieldset>
          <fieldset className="flex items-end gap-2">
            <legend className="mb-3 text-[14px] font-bold">Цена, ₽</legend>
            {(["min", "max"] as const).map((k) => (
              <label key={k} className="flex flex-col gap-1 text-[12px] text-mute">
                {k === "min" ? "от" : "до"}
                <input
                  inputMode="numeric"
                  value={draft[k]}
                  placeholder={k === "min" ? "1 900" : "6 900"}
                  onChange={(e) => setDraft({ ...draft, [k]: e.target.value.replace(/\D/g, "") })}
                  className="h-11 w-[130px] border border-line-2 bg-field px-2.5 text-[14px] text-ink outline-none focus:border-ink"
                />
              </label>
            ))}
          </fieldset>
          <label className="flex h-11 cursor-pointer items-center gap-3 text-[14px]">
            <input type="checkbox" checked={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.checked })} className="h-[18px] w-[18px] accent-ink" />
            Только в наличии
          </label>
        </div>
      </Drawer>
    </main>
  );
}
