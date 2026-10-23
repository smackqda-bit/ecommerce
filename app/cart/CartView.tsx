"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FABRICS, getProduct, img, rub, sizeLabel } from "@/data/products";
import { cartTotal, useHydrated, useStore, type CartItem } from "@/lib/store";
import { Breadcrumbs, ButtonLink, TextLink } from "@/components/ui";
import { EASE, LineReveal, RollingNumber, RouteLine } from "@/components/motion";

type Row = { kind: "item"; item: CartItem } | { kind: "gone"; item: CartItem; index: number };

export default function CartView() {
  const hydrated = useHydrated();
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const remove = useStore((s) => s.remove);
  const restore = useStore((s) => s.restore);
  const [gone, setGone] = useState<{ item: CartItem; index: number }[]>([]);
  const priceChanged = useSearchParams().get("state") === "price-changed";

  const items = hydrated ? cart : [];
  const rows: Row[] = items.map((item) => ({ kind: "item", item }));
  [...gone].sort((a, b) => a.index - b.index).forEach((g) => rows.splice(Math.min(g.index, rows.length), 0, { kind: "gone", ...g }));
  const qty = items.reduce((n, i) => n + i.qty, 0);
  const total = cartTotal(items);

  const onRemove = (key: string) => {
    const index = items.findIndex((i) => i.key === key);
    const it = remove(key);
    if (it) setGone((g) => [...g, { item: it, index }]);
  };
  const onUndo = (g: { item: CartItem; index: number }) => {
    restore(g.item, g.index);
    setGone((list) => list.filter((x) => x.item.key !== g.item.key));
  };

  const empty = hydrated && rows.length === 0;

  return (
    <main className="pb-24">
      <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Корзина" }]} />
      <div className="wrap flex flex-col gap-7 pt-7">
        <LineReveal as="h1" immediate lines={["Корзина"]} className="text-[clamp(36px,4.2vw,56px)] font-extrabold" />

        {priceChanged && !empty && (
          <motion.div role="alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="border border-warn-line bg-warn px-5 py-4 text-[14px] leading-normal">
            Пока ты выбирал, цена на одну из вещей изменилась. Мы пересчитали итог — проверь перед оформлением.
          </motion.div>
        )}

        {empty ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center gap-4 py-24 text-center">
            <RouteLine d="M8 50 C 40 10, 70 60, 112 14" viewBox="0 0 120 60" className="h-[60px] w-[120px] text-ink" start={[8, 50]} end={[112, 14]} duration={1.6} />
            <h2 className="text-[24px] font-bold">В корзине пока пусто</h2>
            <p className="text-[15px] text-mute">Самое время свернуть в каталог.</p>
            <ButtonLink href="/catalog" arrow>В каталог</ButtonLink>
          </motion.div>
        ) : (
          <div className="flex flex-wrap items-start gap-12">
            <ul className="flex min-w-0 flex-[999_1_560px] flex-col border-t border-line">
              <AnimatePresence initial={false}>
                {rows.map((r) => {
                  const p = getProduct(r.item.slug)!;
                  if (r.kind === "gone")
                    return (
                      <motion.li
                        key={"gone" + r.item.key}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="flex items-center justify-between gap-3 overflow-hidden border-b border-line py-5 text-[14px] text-mute"
                      >
                        <span>{p.name} удалён из корзины</span>
                        <button onClick={() => onUndo(r)} className="h-10 border border-ink px-3.5 text-[13px] font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-milk">
                          Вернуть
                        </button>
                      </motion.li>
                    );
                  const it = r.item;
                  const href = `/product/${p.slug}?color=${it.color}`;
                  return (
                    <motion.li
                      key={it.key}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="flex items-start gap-4 border-b border-line py-5 sm:gap-5"
                    >
                      <Link href={href} className="group relative h-[150px] w-[112px] flex-none overflow-hidden bg-stone">
                        <Image src={img(p.slug, it.color, "flat")} alt={`${p.name}, ${FABRICS[it.color].name.toLowerCase()}`} fill sizes="112px" className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                          <Link href={href} className="text-[16px] font-bold hover:text-cobalt">
                            {p.name}
                          </Link>
                          <span className="whitespace-nowrap text-[16px] tabular-nums">{rub(p.price * it.qty)}</span>
                        </div>
                        <span className="text-[14px] text-mute">
                          {FABRICS[it.color].name} · {sizeLabel(it.size)}
                          {it.qty > 1 && ` · ${rub(p.price)} за шт.`}
                        </span>
                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          <div role="group" aria-label="Количество" className="flex items-center border border-line-2">
                            <button onClick={() => (it.qty > 1 ? setQty(it.key, it.qty - 1) : onRemove(it.key))} aria-label="Меньше" className="h-11 w-11 text-[18px] transition-colors hover:bg-sand">
                              −
                            </button>
                            <span className="flex w-8 justify-center text-[15px] font-semibold">
                              <RollingNumber value={it.qty} />
                            </span>
                            <button onClick={() => setQty(it.key, it.qty + 1)} disabled={it.qty >= 9} aria-label="Больше" className="h-11 w-11 text-[18px] transition-colors hover:bg-sand disabled:opacity-30">
                              +
                            </button>
                          </div>
                          <button onClick={() => onRemove(it.key)} className="link-line-on text-[13px] text-mute">
                            Удалить
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            <motion.aside
              aria-label="Итог"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="flex max-w-[420px] flex-[1_1_340px] flex-col gap-4 bg-sand p-7 lg:sticky lg:top-24"
            >
              <div className="flex justify-between text-[15px]">
                <span>Товары · {qty} шт.</span>
                <span className="tabular-nums">{rub(total)}</span>
              </div>
              <div className="flex justify-between gap-4 text-[15px]">
                <span>Доставка</span>
                <span className="text-right text-mute">
                  рассчитаем после
                  <br />
                  выбора способа
                </span>
              </div>
              <div className="flex justify-between border-t border-line-2 pt-4 text-[20px] font-bold">
                <span>Итого</span>
                <RollingNumber value={rub(total)} />
              </div>
              {qty > 0 ? (
                <ButtonLink href="/checkout" size="lg" arrow className="w-full">
                  Перейти к оформлению
                </ButtonLink>
              ) : (
                <span className="flex h-14 items-center justify-center bg-faint text-[15px] font-semibold text-white">Перейти к оформлению</span>
              )}
              <div className="text-center">
                <TextLink href="/catalog">Продолжить покупки</TextLink>
              </div>
            </motion.aside>
          </div>
        )}
      </div>
    </main>
  );
}
