"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE, LineReveal, RouteLine } from "../motion";
import { ButtonLink } from "../ui";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[min(860px,calc(100svh-69px))] items-end overflow-hidden bg-[#2B2A27] md:min-h-[760px]">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          <Image
            src="/images/lifestyle/hero.jpg"
            alt="Двое в вещах ВНЕ ПЛАНА идут по бетонной набережной"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
        </motion.div>
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,28,27,0.05)_30%,rgba(28,28,27,0.75)_100%)]" />

      <RouteLine
        d="M-20 640 C 260 560, 380 700, 620 560 S 980 300, 1180 380 S 1400 180, 1480 120"
        viewBox="0 0 1440 760"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full text-milk/60"
        strokeWidth={2}
        dash="3 10"
        duration={3.2}
        delay={0.6}
        nonScaling
      />

      <motion.div style={{ y: contentY, opacity: fade }} className="wrap relative flex w-full flex-wrap items-end justify-between gap-8 pb-12 md:pb-16">
        <div className="flex max-w-[820px] flex-col gap-5">
          <motion.div
            className="eyebrow flex items-center gap-2.5 text-milk"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-cobalt" />
            Капсула 01 · Маршрут не построен
          </motion.div>
          <LineReveal
            as="h1"
            immediate
            delay={0.45}
            lines={["Маршрут", "не построен"]}
            className="text-[clamp(48px,7.4vw,112px)] font-extrabold leading-[0.95] tracking-[0.015em] text-milk"
          />
          <motion.p
            className="max-w-[480px] text-[17px] leading-relaxed text-[#E9E4D8] md:text-[18px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.85, ease: EASE }}
          >
            Вещи для тех, кто сворачивает не туда — и оказывается ровно там, где нужно.
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 1, ease: EASE }}>
          <ButtonLink href="/catalog" arrow size="lg" variant="primary" className="hover:!text-ink [&>span:first-child]:!bg-milk">
            Смотреть коллекцию
          </ButtonLink>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden h-10 w-px -translate-x-1/2 overflow-hidden bg-milk/20 md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <motion.span className="absolute left-0 top-0 h-1/2 w-px bg-milk" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 2.2, repeat: Infinity, ease: EASE }} />
      </motion.div>
    </section>
  );
}
