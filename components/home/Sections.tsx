"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import { getProduct, img } from "@/data/products";
import { ImageReveal, LineReveal, Reveal, RouteLine, Stagger, StaggerItem } from "../motion";
import { ButtonLink, Eyebrow, TextLink } from "../ui";
import ProductCard from "../ProductCard";

export function Brand() {
  return (
    <section id="brand" className="wrap flex flex-wrap items-center gap-14 py-24 md:py-32">
      <div className="flex flex-[1_1_420px] flex-col gap-6">
        <Reveal><Eyebrow>О бренде</Eyebrow></Reveal>
        <LineReveal lines={["Что значит", "«вне плана»"]} className="text-[clamp(32px,3.6vw,52px)] font-bold leading-[1.08]" />
        <Reveal delay={0.15}>
          <p className="max-w-[560px] text-[17px] leading-relaxed text-ink-2">
            Свернуть не туда, задержаться на чужой лестнице, встретить своих там, где не договаривались. Мы делаем мерч для свободных городских маршрутов — для тех, кто не сверяется с навигатором и знает, что лучшие точки не отмечены на карте.
          </p>
        </Reveal>
        <Reveal delay={0.25}><TextLink href="/about">О бренде</TextLink></Reveal>
      </div>
      <ImageReveal src="/images/lifestyle/stairs.jpg" alt="Бетонная лестница с синими перилами в солнечном свете" className="aspect-[5/4] min-w-0 flex-[1_1_420px]" parallax />
    </section>
  );
}

export function Collection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-24 text-milk md:py-28">
      <RouteLine
        d="M-20 120 C 300 40, 420 260, 720 180 S 1180 60, 1460 220"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 top-0 h-[300px] w-full text-milk/25"
        strokeWidth={1.5}
        progress={progress}
        nonScaling
      />
      <div className="wrap relative flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[680px] flex-col gap-4">
            <Reveal><Eyebrow className="!text-[#A9A39A]">Коллекция и её идея</Eyebrow></Reveal>
            <LineReveal
              lines={["Первая капсула — карта,", "на которой нет", "пункта назначения"]}
              className="text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.08]"
            />
            <Reveal delay={0.2}>
              <p className="max-w-[560px] text-[16px] leading-relaxed text-[#C9C3B8]">
                Графика капсулы — пунктирные маршруты и точки встречи, нарисованные от руки. Молочный, графит и один кобальтовый акцент: как синяя ручка на бумажной карте.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.3}>
            <ButtonLink href="/catalog" variant="outline-light" arrow>Исследовать коллекцию</ButtonLink>
          </Reveal>
        </div>
        <div className="grid gap-3 md:grid-cols-[1.25fr_1fr]">
          <ImageReveal src="/images/lifestyle/map.jpg" alt="Лист бумаги с нарисованным синим маршрутом и карандаш" className="aspect-[4/3] md:row-span-2 md:aspect-auto md:min-h-[580px]" parallax />
          <ImageReveal src="/images/lifestyle/sphere.jpg" alt="Синяя стеклянная сфера на карте маршрута" className="aspect-[16/10] md:aspect-auto md:h-[284px]" delay={0.12} />
          <ImageReveal src="/images/lifestyle/embroidery.jpg" alt="Крупный план вышитого маршрута на ткани" className="aspect-[16/10] md:aspect-auto md:h-[284px]" delay={0.22} />
        </div>
      </div>
    </section>
  );
}

const PICKS: [string, "graphite" | "milk"][] = [
  ["hoodie-vne-plana", "graphite"],
  ["tee-marshrut", "milk"],
  ["longsleeve-liniya", "milk"],
  ["tote-tochki", "milk"],
];

export function Picks() {
  return (
    <section className="wrap flex flex-col gap-8 pt-24 md:pt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Reveal><Eyebrow>Выбор редакции</Eyebrow></Reveal>
          <LineReveal lines={["Что берём в дорогу"]} className="text-[clamp(28px,3vw,42px)] font-bold" />
        </div>
        <Reveal delay={0.2}><TextLink href="/catalog">Все вещи</TextLink></Reveal>
      </div>
      <Stagger className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-4 lg:grid-cols-4">
        {PICKS.map(([slug, color]) => (
          <StaggerItem key={slug}>
            <ProductCard p={getProduct(slug)!} initialColor={color} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

const LOOKS = [
  { src: img("hoodie-vne-plana", "graphite", "life"), alt: "Девушка в графитовом худи у бетонной стены", item: "Худи «Вне плана», графит", href: "/product/hoodie-vne-plana?color=graphite" },
  { src: img("tee-bez-adresa", "milk", "life"), alt: "Девушка в футболке «Без адреса» поднимается по лестнице", item: "Футболка «Без адреса»", href: "/product/tee-bez-adresa" },
  { src: img("tote-tochki", "milk", "front"), alt: "Девушка с молочным шоппером", item: "Шоппер «Точки», молочный", href: "/product/tote-tochki?color=milk" },
];

export function Lookbook() {
  return (
    <section className="wrap flex flex-col gap-8 pt-24 md:pt-28">
      <div className="flex flex-col gap-3">
        <Reveal><Eyebrow>Лукбук</Eyebrow></Reveal>
        <LineReveal lines={["Вещи в городе"]} className="text-[clamp(28px,3vw,42px)] font-bold" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {LOOKS.map((l, i) => (
          <Reveal key={l.src} delay={i * 0.1} y={40}>
            <Link href={l.href} className="group relative block aspect-[4/5] overflow-hidden bg-stone">
              <Image src={l.src} alt={l.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]" />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/10" />
              <span className="absolute bottom-5 left-5 flex items-center gap-2.5 bg-milk px-3.5 py-3 text-[13px] font-semibold">
                <span className="h-2 w-2 rounded-full bg-cobalt" />
                {l.item}
                <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HelpStrip() {
  const items = [
    { href: "/help#sizes", t: "Понятные размеры", d: "Таблица и объяснение oversize-посадки" },
    { href: "/help#delivery", t: "Доставка", d: "Способы, сроки и стоимость" },
    { href: "/help#returns", t: "Обмен и возврат", d: "Условия и порядок за 3 шага" },
  ];
  return (
    <section id="help" className="mt-24 grid border-y border-line md:mt-28 md:grid-cols-4">
      <div className="wrap flex items-start bg-sand py-9">
        <Eyebrow>Покупка без лишних вопросов</Eyebrow>
      </div>
      {items.map((it, i) => (
        <Link key={it.t} href={it.href} className="wrap group relative isolate flex flex-col gap-2 overflow-hidden border-t border-line py-9 md:border-l md:border-t-0">
          <span aria-hidden className="absolute inset-0 -z-10 origin-left scale-x-0 bg-sand transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
          <Reveal delay={i * 0.08} y={12}>
            <b className="text-[16px]">{it.t}</b>
            <span className="mt-2 flex items-center gap-1.5 text-[14px] leading-normal text-mute">
              {it.d}
              <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">→</span>
            </span>
          </Reveal>
        </Link>
      ))}
    </section>
  );
}
