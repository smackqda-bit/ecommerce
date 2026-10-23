"use client";

import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useScrollLock } from "./SmoothScroll";
import { EASE } from "./motion";

function Portal({ children }: { children: React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => setEl(document.body), []);
  return el ? createPortal(children, el) : null;
}

function useEsc(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export function CloseButton({ onClick, label = "Закрыть" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} aria-label={label} className="group flex h-11 w-11 items-center justify-center text-ink">
      <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-90">
        <CloseIcon />
      </span>
    </button>
  );
}

export function Drawer({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  useScrollLock(open);
  useEsc(open, onClose);
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="relative flex h-full w-full max-w-[440px] flex-col bg-milk"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.75, ease: EASE }}
            >
              <div className="flex items-center justify-between px-7 pb-2 pt-5">
                <span className="text-[18px] font-bold">{title}</span>
                <CloseButton onClick={onClose} />
              </div>
              <motion.div
                className="flex-1 overflow-y-auto px-7 py-4"
                data-lenis-prevent
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              >
                {children}
              </motion.div>
              {footer && <div className="border-t border-line px-7 py-5">{footer}</div>}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useScrollLock(open);
  useEsc(open, onClose);
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className={`relative flex max-h-[90dvh] w-full flex-col overflow-y-auto bg-milk p-7 ${wide ? "max-w-[920px]" : "max-w-[560px]"}`}
              data-lenis-prevent
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="text-[20px] font-bold">{title}</span>
                <CloseButton onClick={onClose} />
              </div>
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

/** Полноэкранный просмотр фото */
export function Lightbox({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useScrollLock(open);
  useEsc(open, onClose);
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-milk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-label="Фото крупно"
          >
            <div className="absolute right-4 top-4 z-10">
              <CloseButton onClick={onClose} />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
