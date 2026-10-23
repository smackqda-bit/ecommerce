"use client";

import Link from "next/link";
import { MaskUp, RouteLine } from "./motion";

const cols = [
  { title: "Разделы", links: [["/catalog", "Каталог"], ["/about", "О бренде"], ["/help", "Помощь"], ["/contacts", "Контакты"]] },
  { title: "Покупателям", links: [["/help#delivery", "Доставка и оплата"], ["/help#returns", "Обмен и возврат"], ["/help#sizes", "Размеры и уход"], ["/account", "Мои заказы"]] },
  { title: "Связь", links: [["/contacts", "Поддержка"], ["https://t.me/", "Telegram"], ["https://vk.com/", "VK"]] },
];

export default function Footer() {
  return (
    <footer className="mt-auto overflow-hidden border-t border-line">
      <div className="wrap flex flex-col gap-12 pb-8 pt-16">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex max-w-[320px] flex-col gap-3">
            <span className="text-[18px] font-extrabold tracking-[0.3em]">ВНЕ ПЛАНА</span>
            <span className="text-[14px] leading-relaxed text-mute">Собственный мерч о свободных городских маршрутах.</span>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title} className="flex flex-col gap-2.5 text-[14px]">
              <span className="mb-1 text-[12px] font-bold uppercase tracking-[0.2em] text-mute">{c.title}</span>
              {c.links.map(([href, label]) => (
                <Link key={label} href={href} className="link-line self-start hover:text-cobalt" {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="relative">
          <RouteLine
            d="M8 60 C 220 0, 380 110, 620 40 S 1000 10, 1180 52"
            viewBox="0 0 1200 100"
            className="h-auto w-full text-line-2"
            strokeWidth={1.5}
            start={[8, 60]}
            end={[1180, 52]}
            endColor="#1E3FCC"
            duration={3}
            nonScaling
          />
        </div>

        <MaskUp className="select-none whitespace-nowrap text-center text-[clamp(44px,12.4vw,190px)] font-extrabold leading-[0.9] tracking-[0.12em] text-ink">
          <span aria-hidden>ВНЕ ПЛАНА</span>
        </MaskUp>

        <div className="flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-[12px] text-mute">
          <span>© 2026 ВНЕ ПЛАНА · ИП [Фамилия И. О.], ИНН [000000000000], ОГРНИП [000000000000000]</span>
          <span className="flex gap-5">
            <Link href="/privacy" className="link-line hover:text-ink">Политика данных</Link>
            <Link href="/terms" className="link-line hover:text-ink">Условия продажи</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
