"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { ANGLE_LABEL, CATEGORIES, FABRICS, SIZE_TABLE, getProduct, img, products, rub, sizeLabel, type ColorId, type Size } from "@/data/products";
import { useHydrated, useStore } from "@/lib/store";
import { Breadcrumbs, Heart, TextLink } from "@/components/ui";
import { Lightbox, Modal } from "@/components/Overlay";
import { EASE, Reveal, Stagger, StaggerItem } from "@/components/motion";
import ProductCard from "@/components/ProductCard";
import { LAST_CATALOG_KEY } from "@/lib/utils";

export default function ProductView({ slug }: { slug: string }) {
  const p = getProduct(slug)!;
  const sp = useSearchParams();
  const router = useRouter();
  const qColor = sp.get("color") as ColorId | null;
  const [color, setColor] = useState<ColorId>(p.variants.some((v) => v.color === qColor) ? qColor! : p.variants[0].color);
  const variant = p.variants.find((v) => v.color === color)!;
  const [shot, setShot] = useState(0);
  const oneSize = p.sizes.includes("ONE");
  const [size, setSize] = useState<Size | null>(oneSize ? "ONE" : null);
  const [hint, setHint] = useState(false);
  const [added, setAdded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [back, setBack] = useState("/catalog");
  const shake = useAnimation();
  const hydrated = useHydrated();
  const fav = useStore((s) => s.favs.includes(p.slug));
  const toggleFav = useStore((s) => s.toggleFav);
  const add = useStore((s) => s.add);
  const isFav = hydrated && fav;

  useEffect(() => {
    try {
      const v = sessionStorage.getItem(LAST_CATALOG_KEY);
      if (v) setBack(v);
    } catch {}
  }, []);

  const pickColor = (c: ColorId) => {
    setColor(c);
    setShot(0);
    setAdded(false);
    const v = p.variants.find((x) => x.color === c)!;
    if (size && v.soldOutSizes?.includes(size)) setSize(null);
    router.replace(`/product/${p.slug}?color=${c}`, { scroll: false });
  };

  const onAdd = () => {
    if (p.soldOut) return;
    if (!size) {
      setHint(true);
      shake.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.45 } });
      return;
    }
    add(p.slug, color, size);
    setAdded(true);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const cat = CATEGORIES.find((c) => c.id === p.category)!;
  const soldNote = variant.soldOutSizes?.length
    ? `${variant.soldOutSizes.join(", ")} в цвете «${FABRICS[color].name.toLowerCase()}» закончился.${p.variants.filter((v) => v.color !== color && !v.soldOutSizes?.some((s) => variant.soldOutSizes!.includes(s))).map((v) => ` Есть в цвете «${FABRICS[v.color].name.toLowerCase()}».`)[0] ?? ""}`
    : null;
  const more = products.filter((x) => x.slug !== p.slug).slice(0, 4);
  const table = p.category in SIZE_TABLE ? SIZE_TABLE[p.category as keyof typeof SIZE_TABLE] : null;

  return (
    <main>
      <Breadcrumbs items={[{ href: "/", label: "Главная" }, { href: "/catalog", label: "Каталог" }, { href: `/catalog?cat=${p.category}`, label: cat.label }, { label: p.name }]} />

      <div className="wrap flex flex-wrap items-start gap-10 pb-20 pt-5 lg:gap-12">
        {/* Галерея */}
        <div className="flex min-w-0 flex-[999_1_560px] flex-col-reverse gap-3 md:flex-row lg:sticky lg:top-24">
          <div role="group" aria-label="Миниатюры" className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:w-[76px] md:flex-none md:flex-col md:px-0">
            {variant.shots.map((a, i) => (
              <button
                key={color + a}
                onClick={() => setShot(i)}
                aria-label={`Фото: ${ANGLE_LABEL[a]}`}
                aria-pressed={shot === i}
                className="relative h-[100px] w-[76px] flex-none overflow-hidden bg-stone"
              >
                <Image src={img(p.slug, color, a)} alt="" fill sizes="76px" className={clsx("object-cover transition-[opacity,transform] duration-500", shot === i ? "opacity-100" : "opacity-60 hover:opacity-100")} />
                {shot === i && <motion.span layoutId="thumb" className="absolute inset-0 border-2 border-ink" transition={{ duration: 0.5, ease: EASE }} />}
              </button>
            ))}
          </div>
          <div className="group relative aspect-[3/4] min-w-0 flex-1 overflow-hidden bg-stone">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={color + shot}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <Image
                  src={img(p.slug, color, variant.shots[shot])}
                  alt={`${p.name}, ${FABRICS[color].name.toLowerCase()}: ${ANGLE_LABEL[variant.shots[shot]]}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <button onClick={() => setZoom(true)} aria-label="Увеличить фото" className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center bg-milk text-ink transition-transform duration-500 ease-[var(--ease-out-expo)] hover:scale-105">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4M8 11h6M11 8v6" /></svg>
            </button>
            <div className="absolute bottom-4 left-4 flex gap-1.5" aria-hidden>
              {variant.shots.map((_, i) => (
                <span key={i} className={clsx("h-[3px] rounded-full bg-milk transition-all duration-500", i === shot ? "w-6" : "w-3 opacity-50")} />
              ))}
            </div>
          </div>
        </div>

        {/* Информация */}
        <div className="flex max-w-[460px] flex-[1_1_380px] flex-col gap-6">
          <Link href={back} className="group flex items-center gap-2 text-[13px] text-mute hover:text-ink">
            <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-x-1">←</span> Назад в каталог
          </Link>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[12px] text-mute">КАПСУЛА 01 · МАРШРУТ НЕ ПОСТРОЕН</span>
              <h1 className="text-[30px] font-bold leading-tight">{p.name}</h1>
              <span className="text-[20px] tabular-nums">{rub(p.price)}</span>
            </div>
            <button onClick={() => toggleFav(p.slug)} aria-pressed={isFav} aria-label={isFav ? "Убрать из избранного" : "В избранное"} className="flex h-12 w-12 flex-none items-center justify-center border border-line-2 transition-colors duration-300 hover:border-ink">
              <Heart on={isFav} size={20} />
            </button>
          </div>
          <p className="text-[15px] leading-relaxed text-ink-2">{p.idea}</p>

          <div className="flex flex-col gap-2.5">
            <span className="text-[14px]">
              Цвет: <b>{FABRICS[color].name}</b>
            </span>
            <div role="group" aria-label="Цвет" className="flex flex-wrap gap-2">
              {p.variants.map((v) => {
                const on = v.color === color;
                return (
                  <button
                    key={v.color}
                    onClick={() => pickColor(v.color)}
                    aria-pressed={on}
                    className={clsx("relative flex h-11 items-center gap-2 px-3.5 text-[13px] font-semibold transition-colors", on ? "" : "border border-line-2 hover:border-ink")}
                  >
                    {on && <motion.span layoutId="color-box" className="absolute inset-0 border-2 border-ink" transition={{ duration: 0.5, ease: EASE }} />}
                    <span className="h-3.5 w-3.5 rounded-full shadow-[0_0_0_1px_var(--color-line-2)]" style={{ background: FABRICS[v.color].hex }} />
                    {FABRICS[v.color].name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between text-[14px]">
              <span>Размер</span>
              {!oneSize && (
                <button onClick={() => setSizeOpen(true)} className="link-line-on">
                  Как выбрать размер?
                </button>
              )}
            </div>
            {oneSize ? (
              <div className="flex h-12 items-center border border-ink px-4 text-[14px] font-semibold">Единый размер</div>
            ) : (
              <motion.div animate={shake} role="group" aria-label="Размер" className="grid grid-cols-4 gap-1.5">
                {p.sizes.map((s) => {
                  const off = !!variant.soldOutSizes?.includes(s);
                  const on = size === s;
                  return (
                    <button
                      key={s}
                      aria-pressed={on}
                      aria-disabled={off}
                      onClick={() => {
                        if (off) return;
                        setSize(s);
                        setHint(false);
                        setAdded(false);
                      }}
                      className={clsx(
                        "relative h-12 text-[14px] font-semibold transition-colors duration-300",
                        off ? "cursor-not-allowed border border-line text-faint line-through" : on ? "text-milk" : clsx("border hover:border-ink", hint ? "border-error" : "border-line-2")
                      )}
                    >
                      {on && <motion.span layoutId="size-box" className="absolute inset-0 bg-ink" transition={{ duration: 0.45, ease: EASE }} />}
                      <span className="relative">{sizeLabel(s)}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
            <AnimatePresence>
              {hint && (
                <motion.span role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[13px] font-semibold text-error">
                  Выбери размер — без него вещь не добавить в корзину
                </motion.span>
              )}
            </AnimatePresence>
            {soldNote && <span className="text-[13px] text-mute">{soldNote}</span>}
          </div>

          <button
            onClick={onAdd}
            disabled={p.soldOut}
            className={clsx(
              "group relative isolate h-14 overflow-hidden text-[15px] font-semibold tracking-[0.04em] text-white transition-colors duration-500 disabled:cursor-not-allowed",
              p.soldOut ? "bg-faint" : justAdded ? "bg-ink" : "bg-cobalt"
            )}
          >
            {!p.soldOut && <span aria-hidden className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink transition-transform duration-[650ms] ease-[var(--ease-out-expo)] group-hover:scale-y-100" />}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={p.soldOut ? "sold" : justAdded ? "done" : "add"}
                className="flex items-center justify-center gap-2"
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {p.soldOut ? "Нет в наличии" : justAdded ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: EASE }} />
                    </svg>
                    Добавлено
                  </>
                ) : (
                  "Добавить в корзину"
                )}
              </motion.span>
            </AnimatePresence>
          </button>
          <AnimatePresence>
            {added && (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="-mt-3 flex items-center justify-between gap-3 bg-ok px-4 py-3.5 text-[14px]"
              >
                <span>
                  ✓ Добавлено: {FABRICS[color].name}, {size && sizeLabel(size)}
                </span>
                <TextLink href="/cart">В корзину</TextLink>
              </motion.div>
            )}
          </AnimatePresence>

          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 border-y border-line py-4 text-[14px]">
            <dt className="text-mute">Состав</dt>
            <dd>{p.composition}</dd>
            <dt className="text-mute">Уход</dt>
            <dd>{p.care}</dd>
            <dt className="text-mute">{oneSize ? "Размер" : "На фото"}</dt>
            <dd>{p.model}</dd>
          </dl>

          <div className="flex flex-col gap-2 text-[14px]">
            <span>→ Доставка 1–4 дня, стоимость считается при оформлении</span>
            <span>↺ Обмен и возврат — 14 дней</span>
            <Link href="/help#delivery" className="link-line-on self-start text-mute">
              Подробнее об условиях
            </Link>
          </div>
        </div>
      </div>

      <section className="wrap flex flex-col gap-6 pb-24">
        <Reveal>
          <h2 className="text-[24px] font-bold">Ещё из капсулы</h2>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-4 lg:grid-cols-4">
          {more.map((m) => (
            <StaggerItem key={m.slug}>
              <ProductCard p={m} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Modal open={sizeOpen} onClose={() => setSizeOpen(false)} title="Как выбрать размер">
        <p className="mb-5 text-[14px] leading-relaxed text-mute">{p.fit}</p>
        {table && (
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-ink text-left">
                <th className="py-2.5 font-semibold">Размер</th>
                <th className="font-semibold">Грудь, см</th>
                <th className="font-semibold">Длина, см</th>
                <th className="font-semibold">Рост, см</th>
              </tr>
            </thead>
            <tbody>
              {table.map(([s, chest, len, h], i) => (
                <motion.tr key={s} className="border-b border-line" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: EASE }}>
                  <td className="py-2.5 font-semibold">{s}</td>
                  <td>{chest}</td>
                  <td>{len}</td>
                  <td>{h}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-4 text-[13px] text-mute">Замеры вещи в разложенном виде, погрешность ±1,5 см.</p>
      </Modal>

      <Lightbox open={zoom} onClose={() => setZoom(false)}>
        <motion.div className="relative h-[86dvh] w-[min(64.5dvh,92vw)]" initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: EASE }}>
          <Image src={img(p.slug, color, variant.shots[shot])} alt={`${p.name} крупно`} fill sizes="90vw" className="object-contain" />
        </motion.div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {variant.shots.map((a, i) => (
            <button key={a} onClick={() => setShot(i)} aria-label={`Фото: ${ANGLE_LABEL[a]}`} className={clsx("h-11 w-11 text-[13px] font-semibold", i === shot ? "bg-ink text-milk" : "border border-line-2")}>
              {i + 1}
            </button>
          ))}
        </div>
      </Lightbox>
    </main>
  );
}
