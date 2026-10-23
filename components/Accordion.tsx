"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { EASE } from "./motion";

export function AccordionItem({ q, children, defaultOpen }: { q: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-line">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-semibold">
        <span className="transition-colors duration-300 group-hover:text-cobalt">{q}</span>
        <span aria-hidden className="relative h-4 w-4 flex-none">
          <span className="absolute left-0 top-1/2 h-[1.6px] w-4 -translate-y-1/2 bg-current" />
          <motion.span className="absolute left-1/2 top-0 h-4 w-[1.6px] -translate-x-1/2 bg-current" animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }} transition={{ duration: 0.5, ease: EASE }} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="overflow-hidden">
            <div className="max-w-[680px] pb-6 text-[15px] leading-relaxed text-ink-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
