"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import clsx from "clsx";
import { FABRICS, cardImage, hoverImage, rub, type ColorId, type Product } from "@/data/products";
import { useHydrated, useStore } from "@/lib/store";
import { Heart } from "./ui";
import { EASE } from "./motion";

export default function ProductCard({ p, initialColor, sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw", priority }: { p: Product; initialColor?: ColorId; sizes?: string; priority?: boolean }) {
  const [color, setColor] = useState<ColorId>(initialColor ?? p.variants[0].color);
  const fav = useStore((s) => s.favs.includes(p.slug));
  const toggleFav = useStore((s) => s.toggleFav);
  const hydrated = useHydrated();
  const isFav = hydrated && fav;
  const href = `/product/${p.slug}?color=${color}`;
  const hover = hoverImage(p, color);

  return (
    <div className={clsx("group/card flex flex-col gap-3", p.soldOut && "opacity-70")}>
      <div className="relative aspect-[3/4] overflow-hidden bg-stone">
        <Link href={href} className="absolute inset-0" aria-label={`${p.name}, ${FABRICS[color].name.toLowerCase()}`}>
          <AnimatePresence initial={false}>
            <motion.div
              key={color}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Image
                src={cardImage(p, color)}
                alt=""
                fill
                sizes={sizes}
                priority={priority}
                className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover/card:scale-[1.04]"
              />
              {hover && (
                <Image
                  src={hover}
                  alt=""
                  fill
                  sizes={sizes}
                  className="object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-soft)] [@media(hover:hover)]:group-hover/card:opacity-100"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Link>
        <button
          onClick={() => toggleFav(p.slug)}
          aria-pressed={isFav}
          aria-label={`${isFav ? "Убрать из избранного" : "В избранное"}: ${p.name}`}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-milk/90 text-ink backdrop-blur transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] hover:scale-105 hover:bg-milk"
        >
          <Heart on={isFav} />
        </button>
        {p.soldOut && <span className="absolute bottom-2 left-2 bg-ink px-2.5 py-1.5 text-[12px] font-semibold text-milk">Нет в наличии</span>}
      </div>
      <Link href={href} className="flex justify-between gap-3 text-[14px]">
        <span className="font-semibold transition-colors duration-300 group-hover/card:text-cobalt">{p.name}</span>
        <span className="whitespace-nowrap tabular-nums">{rub(p.price)}</span>
      </Link>
      <div role="group" aria-label={`Цвет: ${p.name}`} className="flex items-center gap-1.5">
        {p.variants.map((v) => {
          const on = v.color === color;
          return (
            <button
              key={v.color}
              onClick={() => setColor(v.color)}
              aria-label={FABRICS[v.color].name}
              aria-pressed={on}
              className="relative flex h-7 w-7 items-center justify-center"
            >
              <span
                className={clsx(
                  "h-[18px] w-[18px] rounded-full transition-[box-shadow,transform] duration-500 ease-[var(--ease-out-expo)]",
                  on ? "shadow-[0_0_0_3px_var(--color-milk),0_0_0_4.5px_var(--color-ink)]" : "shadow-[0_0_0_1px_var(--color-line-2)] hover:scale-110"
                )}
                style={{ background: FABRICS[v.color].hex }}
              />
            </button>
          );
        })}
        <span className="ml-1 text-[12px] text-mute">{FABRICS[color].name.toLowerCase()}</span>
      </div>
    </div>
  );
}
