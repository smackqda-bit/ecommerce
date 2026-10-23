"use client";

import { motion } from "motion/react";
import { Breadcrumbs, Eyebrow } from "./ui";
import { EASE, LineReveal } from "./motion";

export default function PageHead({ crumb, eyebrow, title, lede, children }: { crumb: string; eyebrow?: string; title: string[]; lede?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: crumb }]} />
      <header className="wrap flex flex-col gap-5 pb-10 pt-8 md:pb-14 md:pt-12">
        {eyebrow && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
            <Eyebrow dot>{eyebrow}</Eyebrow>
          </motion.div>
        )}
        <LineReveal as="h1" immediate delay={0.1} lines={title} className="max-w-[1000px] text-[clamp(38px,5.4vw,80px)] font-extrabold leading-[1] tracking-[0.01em]" />
        {lede && (
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.35, ease: EASE }} className="max-w-[620px] text-[17px] leading-relaxed text-ink-2">
            {lede}
          </motion.p>
        )}
        {children}
      </header>
    </>
  );
}
