"use client";

import { AnimatePresence, motion } from "motion/react";
import PageHead from "@/components/PageHead";
import ProductCard from "@/components/ProductCard";
import { ButtonLink } from "@/components/ui";
import { EASE, RouteLine } from "@/components/motion";
import { getProduct } from "@/data/products";
import { useHydrated, useStore } from "@/lib/store";
import { pieces } from "@/lib/utils";

export default function FavoritesPage() {
  const hydrated = useHydrated();
  const favs = useStore((s) => s.favs);
  const list = hydrated ? favs.map(getProduct).filter((p) => !!p) : [];

  return (
    <main className="pb-24">
      <PageHead crumb="Избранное" eyebrow="Избранное" title={["Отложено", "на потом"]} lede={hydrated && list.length ? `${pieces(list.length)} — сохраняются в этом браузере.` : undefined} />
      <div className="wrap">
        {hydrated && list.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-16 text-center">
            <RouteLine d="M10 50 C 50 10, 90 60, 150 16" viewBox="0 0 160 60" className="h-[60px] w-[160px] text-ink" start={[10, 50]} end={[150, 16]} duration={1.4} />
            <h2 className="text-[24px] font-bold">Здесь пока пусто</h2>
            <p className="max-w-[420px] text-[15px] text-mute">Нажмите на сердечко у вещи, чтобы вернуться к ней позже.</p>
            <ButtonLink href="/catalog" arrow>
              В каталог
            </ButtonLink>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-9 md:gap-x-4 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div key={p!.slug} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}>
                  <ProductCard p={p!} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
}
