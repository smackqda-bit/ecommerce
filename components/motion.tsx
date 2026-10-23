"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useId, useRef } from "react";
import clsx from "clsx";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

/** Мягкое появление при прокрутке: прозрачность + небольшой подъём */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
  amount = 0.25,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "p" | "h2" | "aside";
  amount?: number;
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Строки заголовка выезжают из-под маски по очереди */
export function LineReveal({
  lines,
  className,
  delay = 0,
  as = "h2",
  immediate = false,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const show = immediate || inView;
  const Tag = as;
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block will-change-transform"
            initial={{ y: "105%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 1.2, delay: delay + i * 0.09, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Фото открывается шторкой снизу, внутри — лёгкий отъезд масштаба */
export function ImageReveal({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
  delay = 0,
  position = "50% 50%",
  parallax = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  delay?: number;
  position?: string;
  parallax?: boolean;
}) {
  // Наблюдаем за внешним (не обрезанным) блоком: у обрезанного clip-path элемента IntersectionObserver молчит
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], parallax ? ["-6%", "6%"] : ["0%", "0%"]);
  return (
    <div ref={ref} className={clsx("relative", className)}>
      <motion.div
        className="absolute inset-0 overflow-hidden bg-stone"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.4, delay, ease: EASE }}
      >
        <motion.div className="absolute inset-x-0 -inset-y-[7%]" style={{ y }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.18 }}
            animate={inView ? { scale: 1 } : undefined}
            transition={{ duration: 2, delay, ease: EASE }}
          >
            <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Текст выезжает из-под маски; наблюдаем за маской, а не за спрятанным текстом */
export function MaskUp({ children, className, delay = 0, amount = 0.6 }: { children: React.ReactNode; className?: string; delay?: number; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div className={className} initial={{ y: "100%" }} animate={inView ? { y: "0%" } : undefined} transition={{ duration: 1.4, delay, ease: EASE }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Пунктирный маршрут, который «прорисовывается».
 * Пунктир и pathLength конфликтуют, поэтому рисуем сплошную линию в маске поверх пунктира.
 */
export function RouteLine({
  d,
  viewBox,
  className,
  stroke = "currentColor",
  strokeWidth = 2,
  dash = "3 9",
  progress,
  duration = 2.4,
  delay = 0,
  start,
  end,
  endColor = "#1E3FCC",
  preserveAspectRatio,
  nonScaling,
}: {
  d: string;
  viewBox: string;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
  dash?: string;
  progress?: MotionValue<number>;
  duration?: number;
  delay?: number;
  start?: [number, number];
  end?: [number, number];
  endColor?: string;
  preserveAspectRatio?: string;
  nonScaling?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const anim = progress ? { style: { pathLength: progress } } : { initial: { pathLength: 0 }, animate: inView ? { pathLength: 1 } : undefined, transition: { duration, delay, ease: EASE_SOFT } };
  return (
    <svg ref={ref} viewBox={viewBox} className={className} aria-hidden="true" preserveAspectRatio={preserveAspectRatio} fill="none">
      <defs>
        <mask id={`m${id}`} maskUnits="userSpaceOnUse">
          <motion.path d={d} stroke="#fff" strokeWidth={strokeWidth * 4} strokeLinecap="round" fill="none" {...anim} />
        </mask>
      </defs>
      <path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
        mask={`url(#m${id})`}
        vectorEffect={nonScaling ? "non-scaling-stroke" : undefined}
      />
      {start && (
        <motion.circle
          cx={start[0]}
          cy={start[1]}
          r={strokeWidth * 3}
          fill={endColor}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ duration: 0.6, delay, ease: EASE }}
          style={{ transformOrigin: `${start[0]}px ${start[1]}px` }}
        />
      )}
      {end && (
        <motion.circle
          cx={end[0]}
          cy={end[1]}
          r={strokeWidth * 3.2}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.7, delay: delay + duration * 0.9, ease: EASE }}
          style={{ transformOrigin: `${end[0]}px ${end[1]}px` }}
        />
      )}
    </svg>
  );
}

/** Число, которое прокручивается при изменении (счётчики корзины/избранного) */
export function RollingNumber({ value, className }: { value: number | string; className?: string }) {
  return (
    <span className={clsx("relative inline-flex overflow-hidden tabular-nums", className)} style={{ height: "1.2em", lineHeight: "1.2em" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(value)}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Контейнер, который показывает детей по очереди */
export function Stagger({ children, className, gap = 0.08, amount = 0.15 }: { children: React.ReactNode; className?: string; gap?: number; amount?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
};

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
