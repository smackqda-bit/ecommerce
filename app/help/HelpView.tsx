"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import PageHead from "@/components/PageHead";
import { AccordionItem } from "@/components/Accordion";
import { EASE, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SIZE_TABLE } from "@/data/products";
import { DELIVERY } from "@/lib/store";
import { rub } from "@/data/products";
import { TextLink } from "@/components/ui";

const SECTIONS = [
  { id: "delivery", label: "Доставка и оплата" },
  { id: "returns", label: "Обмен и возврат" },
  { id: "sizes", label: "Размеры и уход" },
  { id: "faq", label: "Частые вопросы" },
];

const TABS = [
  { id: "tees", label: "Футболки" },
  { id: "hoodies", label: "Худи" },
  { id: "longsleeves", label: "Лонгсливы" },
] as const;

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-6 text-[clamp(26px,2.6vw,36px)] font-bold">{children}</h2>;
}

export default function HelpView() {
  const [active, setActive] = useState("delivery");
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("tees");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-40% 0px -55% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="pb-24">
      <PageHead crumb="Помощь" eyebrow="Помощь покупателю" title={["Покупка без", "лишних вопросов"]} lede="Всё про доставку, оплату, обмен и размеры — коротко и по делу. Не нашли ответ? Напишите нам, отвечаем в течение часа." />

      <div className="wrap grid gap-12 md:grid-cols-[220px_1fr] lg:gap-20">
        <nav aria-label="Разделы помощи" className="hidden md:block">
          <ul className="sticky top-24 flex flex-col gap-1 border-l border-line">
            {SECTIONS.map((s) => (
              <li key={s.id} className="relative">
                {active === s.id && <motion.span layoutId="help-nav" className="absolute -left-px top-0 h-full w-0.5 bg-cobalt" transition={{ duration: 0.5, ease: EASE }} />}
                <a href={`#${s.id}`} className={clsx("block py-2 pl-5 text-[14px] transition-colors duration-300", active === s.id ? "font-semibold text-ink" : "text-mute hover:text-ink")}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-24">
          <section id="delivery" className="scroll-mt-28">
            <Reveal><H2>Доставка и оплата</H2></Reveal>
            <Stagger className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(DELIVERY) as (keyof typeof DELIVERY)[]).map((k) => (
                <StaggerItem key={k} className="flex flex-col gap-2 bg-sand p-6">
                  <span className="font-mono text-[12px] tracking-[0.14em] text-mute">{k === "pvz" ? "СДЭК" : "КУРЬЕР"}</span>
                  <b className="text-[18px]">{DELIVERY[k].title}</b>
                  <span className="text-[14px] text-ink-2">{DELIVERY[k].sub} · по Москве {rub(DELIVERY[k].price)}</span>
                  <span className="text-[13px] text-mute">В другие города — по тарифу СДЭК, рассчитаем при оформлении.</span>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-6 max-w-[680px] text-[15px] leading-relaxed text-ink-2">
              <p>Оплата — банковской картой онлайн (МИР, Visa, Mastercard) на защищённой странице платёжного сервиса. Чек придёт на email сразу после оплаты. Отправляем заказ в течение 1–2 рабочих дней.</p>
            </Reveal>
          </section>

          <section id="returns" className="scroll-mt-28">
            <Reveal><H2>Обмен и возврат</H2></Reveal>
            <Reveal className="mb-8 max-w-[680px] text-[15px] leading-relaxed text-ink-2">
              <p>Вернуть или обменять вещь можно в течение 14 дней после получения, если она не была в носке и сохранены бирки.</p>
            </Reveal>
            <Stagger className="grid gap-px bg-line sm:grid-cols-3">
              {[
                ["01", "Напишите нам", "В поддержку или Telegram — номер заказа и что хотите вернуть."],
                ["02", "Отправьте вещь", "Пришлём код возврата СДЭК. Отправка за наш счёт, если вещь с браком."],
                ["03", "Получите деньги", "Вернём на карту в течение 3–10 дней после получения посылки."],
              ].map(([n, t, d]) => (
                <StaggerItem key={n} className="flex flex-col gap-3 bg-milk p-6">
                  <span className="font-mono text-[13px] text-cobalt">{n}</span>
                  <b className="text-[17px]">{t}</b>
                  <span className="text-[14px] leading-relaxed text-ink-2">{d}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          <section id="sizes" className="scroll-mt-28">
            <Reveal><H2>Размеры и уход</H2></Reveal>
            <Reveal className="mb-6 max-w-[680px] text-[15px] leading-relaxed text-ink-2">
              <p>Наши вещи сшиты свободно. Свой обычный размер — расслабленная посадка, на размер больше — выраженный oversize. Замеры — вещи в разложенном виде, погрешность ±1,5 см.</p>
            </Reveal>
            <div role="tablist" aria-label="Тип вещи" className="mb-5 flex gap-2">
              {TABS.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={clsx("relative h-10 border border-ink px-4 text-[13px] font-medium", tab === t.id ? "text-milk" : "hover:bg-sand")}>
                  {tab === t.id && <motion.span layoutId="size-tab" className="absolute inset-0 bg-ink" transition={{ duration: 0.5, ease: EASE }} />}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-[15px]">
                <thead>
                  <tr className="border-b border-ink text-left">
                    <th className="py-3 font-semibold">Размер</th>
                    <th className="font-semibold">Ширина по груди ×2, см</th>
                    <th className="font-semibold">Длина, см</th>
                    <th className="font-semibold">Рост, см</th>
                  </tr>
                </thead>
                <tbody key={tab}>
                  {SIZE_TABLE[tab].map(([s, c, l, h], i) => (
                    <motion.tr key={s} className="border-b border-line" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}>
                      <td className="py-3 font-semibold">{s}</td>
                      <td>{c}</td>
                      <td>{l}</td>
                      <td>{h}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Reveal className="mt-8 grid gap-3 sm:grid-cols-4">
              {["Стирка при 30°", "Наизнанку", "Без отбеливания", "Гладить по изнанке"].map((c) => (
                <div key={c} className="flex items-center gap-3 border border-line px-4 py-3.5 text-[14px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cobalt" />
                  {c}
                </div>
              ))}
            </Reveal>
          </section>

          <section id="faq" className="scroll-mt-28">
            <Reveal><H2>Частые вопросы</H2></Reveal>
            <div className="border-t border-line">
              <AccordionItem q="Можно оформить заказ без регистрации?" defaultOpen>Да. Достаточно имени, телефона и email. Личный кабинет нужен только чтобы смотреть историю заказов — вход по коду из письма, без паролей.</AccordionItem>
              <AccordionItem q="Как понять, что размер подойдёт?">Сравните замеры из таблицы с любимой вещью из шкафа. На странице каждого товара указан рост модели и размер на фото. Если сомневаетесь — напишите, подскажем.</AccordionItem>
              <AccordionItem q="Будет ли повтор распроданных моделей?">Капсулы выходят ограниченным тиражом. Иногда мы допечатываем популярные цвета — подпишитесь на наш Telegram, чтобы не пропустить.</AccordionItem>
              <AccordionItem q="Принт не облезет после стирки?">Мы используем вышивку и шелкографию пластизолем. При стирке наизнанку при 30° графика держится годами.</AccordionItem>
              <AccordionItem q="Можно ли вернуть кепку или шоппер?">Да, условия те же — 14 дней, если вещь не была в использовании.</AccordionItem>
            </div>
            <div className="mt-8">
              <TextLink href="/contacts">Не нашли ответ — напишите нам</TextLink>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
