"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import PageHead from "@/components/PageHead";
import { ImageReveal, Reveal, RouteLine, Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink, Eyebrow } from "@/components/ui";

const MANIFEST =
  "Мы не против карт. Мы за то, чтобы иногда их закрывать. Свернуть во двор, потому что там свет. Задержаться на лестнице, потому что там тепло. Встретить своих там, где не договаривались. Вещи ВНЕ ПЛАНА — для таких дней.";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="text-[clamp(26px,3.4vw,50px)] font-bold leading-[1.18]">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

const PRINCIPLES = [
  { n: "01", t: "Свернуть", d: "Лучшие места не отмечены на карте. Мы делаем вещи, в которых удобно идти без цели — свободная посадка, плотный хлопок, ничего лишнего." },
  { n: "02", t: "Задержаться", d: "Тихая графика вместо крика логотипа. Пунктир, три точки, одна надпись — чтобы вещь хотелось носить годами, а не сезон." },
  { n: "03", t: "Встретить своих", d: "Маленькие тиражи, капсулы вместо коллекций. Каждая — история одного маршрута, который мы прошли сами." },
];

export default function AboutView() {
  return (
    <main>
      <PageHead crumb="О бренде" eyebrow="О бренде" title={["Что значит", "«вне плана»"]} lede="ВНЕ ПЛАНА — собственный бренд мерча о свободных городских маршрутах. Мы шьём одежду и аксессуары для прогулок, которые не помещаются в расписание." />

      <ImageReveal src="/images/lifestyle/crossing.jpg" alt="Пешеходный переход сверху, люди идут в разные стороны" className="aspect-[16/9] max-h-[78vh] w-full" priority parallax sizes="100vw" />

      <section className="wrap grid gap-10 py-24 md:grid-cols-[1fr_2.2fr] md:py-32">
        <Reveal>
          <Eyebrow>Манифест</Eyebrow>
        </Reveal>
        <ScrollWords text={MANIFEST} />
      </section>

      <section className="border-y border-line">
        <Stagger className="grid md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <StaggerItem key={p.n} className={`wrap flex flex-col gap-4 py-12 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
              <span className="font-mono text-[13px] text-cobalt">{p.n}</span>
              <h3 className="text-[26px] font-bold">{p.t}</h3>
              <p className="text-[15px] leading-relaxed text-ink-2">{p.d}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="wrap grid gap-4 py-24 md:grid-cols-2 md:py-28">
        <ImageReveal src="/images/lifestyle/facade.jpg" alt="Стеклянный фасад с отражением неба" className="aspect-[4/3]" parallax />
        <ImageReveal src="/images/lifestyle/shadows.jpg" alt="Тени перил на бетонной стене" className="aspect-[4/3] md:mt-24" delay={0.1} parallax />
      </section>

      <section className="relative overflow-hidden bg-ink py-24 text-milk md:py-32">
        <RouteLine d="M-20 220 C 260 60, 480 300, 760 160 S 1200 40, 1460 140" viewBox="0 0 1440 300" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-8 h-[300px] w-full text-milk/25" strokeWidth={1.5} duration={3.4} nonScaling />
        <div className="wrap relative flex flex-wrap items-end justify-between gap-10">
          <div className="flex max-w-[640px] flex-col gap-5">
            <Reveal>
              <Eyebrow className="!text-[#A9A39A]">Первая капсула</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-[clamp(32px,3.8vw,56px)] font-bold leading-[1.06]">«Маршрут не построен»</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[16px] leading-relaxed text-[#C9C3B8]">
                Шесть моделей, двенадцать сочетаний цвета. Молочный, графит, серый меланж и один кобальтовый акцент — как синяя ручка на бумажной карте. Графику мы рисовали от руки, прямо по картам районов, где гуляли весной.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.3}>
            <ButtonLink href="/catalog" variant="light" arrow>
              Смотреть капсулу
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
