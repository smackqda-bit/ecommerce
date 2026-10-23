"use client";

import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui";
import { EASE, RouteLine } from "@/components/motion";

export default function NotFound() {
  return (
    <main className="wrap relative flex flex-1 flex-col items-start justify-center gap-6 overflow-hidden py-28">
      <RouteLine d="M10 160 C 120 20, 260 220, 380 90 S 520 60, 560 120" viewBox="0 0 600 200" className="w-full max-w-[600px] text-ink" start={[10, 160]} duration={2.2} />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="font-mono text-[13px] tracking-[0.14em] text-mute">ОШИБКА 404</motion.span>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: EASE }} className="text-[clamp(40px,6vw,88px)] font-extrabold leading-none">
        Вы свернули<br />слишком далеко
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="max-w-[460px] text-[17px] text-ink-2">
        Такой страницы нет — но это не повод возвращаться по своим следам.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: EASE }} className="flex flex-wrap gap-2">
        <ButtonLink href="/" arrow>На главную</ButtonLink>
        <ButtonLink href="/catalog" variant="outline">В каталог</ButtonLink>
      </motion.div>
    </main>
  );
}
