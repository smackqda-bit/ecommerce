"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import clsx from "clsx";
import { FABRICS, getProduct, img, rub, sizeLabel } from "@/data/products";
import { DELIVERY, useHydrated, useStore } from "@/lib/store";
import { Breadcrumbs, ButtonLink } from "@/components/ui";
import { EASE, ImageReveal, LineReveal } from "@/components/motion";

export default function ThanksView() {
  const id = useSearchParams().get("order");
  const hydrated = useHydrated();
  const orders = useStore((s) => s.orders);
  const setStatus = useStore((s) => s.setOrderStatus);
  const order = hydrated ? (id ? orders.find((o) => o.id === id) : orders[0]) : undefined;
  const status = order?.status ?? "paid";

  // Мок: «банк» подтверждает оплату через несколько секунд
  useEffect(() => {
    if (order?.status !== "pending") return;
    const t = setTimeout(() => setStatus(order.id, "paid"), 6000);
    return () => clearTimeout(t);
  }, [order, setStatus]);

  if (hydrated && !order) {
    return (
      <main className="wrap flex flex-1 flex-col items-center justify-center gap-4 py-28 text-center">
        <h1 className="text-[28px] font-bold">Заказ не найден</h1>
        <p className="text-mute">Возможно, он оформлен в другом браузере.</p>
        <ButtonLink href="/catalog" arrow>В каталог</ButtonLink>
      </main>
    );
  }

  const dot = status === "paid" ? "#1E3FCC" : status === "pending" ? "#C9BFAE" : "#B3261E";
  const badge = status === "paid" ? "bg-ok text-cobalt" : status === "pending" ? "bg-warn text-[#7A4E00]" : "bg-[#F7E1DF] text-error";
  const label = status === "paid" ? "Оплачен" : status === "pending" ? "Ждём банк" : "Не оплачен";
  const d = order ? DELIVERY[order.delivery.method] : DELIVERY.pvz;
  const eta = order ? new Date(order.createdAt + (order.delivery.method === "pvz" ? 4 : 3) * 864e5).toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) : "";

  return (
    <main className="pb-24">
      <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: status === "paid" ? "Спасибо за покупку" : "Статус оплаты" }]} />
      <div className="wrap flex flex-wrap items-start gap-14 pt-12">
        <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-5">
          <ImageReveal src="/images/lifestyle/package.jpg" alt="Упаковка заказа: коробка, шоппер, футболка и бирка ВНЕ ПЛАНА" className="aspect-[16/9] w-full max-w-[560px]" priority />

          <svg width="220" height="90" viewBox="0 0 220 90" aria-hidden className="overflow-visible">
            <defs>
              <mask id="thx">
                <motion.path d="M10 75 C 60 10, 110 90, 160 30 S 200 20, 205 18" stroke="#fff" strokeWidth="8" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: status === "failed" ? 0.62 : 1 }} transition={{ duration: 1.8, delay: 0.5, ease: EASE }} />
              </mask>
            </defs>
            <path d="M10 75 C 60 10, 110 90, 160 30 S 200 20, 205 18" fill="none" stroke="#1C1C1B" strokeWidth="2" strokeDasharray="3 8" mask="url(#thx)" />
            <circle cx="10" cy="75" r="7" fill="#1C1C1B" />
            <motion.circle cx="205" cy="18" r="10" fill={dot} initial={{ scale: 0 }} animate={{ scale: status === "failed" ? 0 : 1 }} transition={{ duration: 0.7, delay: 2.1, ease: [0.34, 1.56, 0.64, 1] }} style={{ transformOrigin: "205px 18px" }} />
            {status === "failed" && (
              <motion.path d="M150 30 l12 12 M162 30 l-12 12" stroke="#B3261E" strokeWidth="2.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.1, duration: 0.5 }} />
            )}
            {status === "pending" && (
              <motion.circle cx="205" cy="18" r="10" fill="none" stroke="#C9BFAE" strokeWidth="2" animate={{ scale: [1, 1.9], opacity: [0.8, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 2.2 }} style={{ transformOrigin: "205px 18px" }} />
            )}
          </svg>

          <AnimatePresence mode="wait">
            <motion.div key={status} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.6, ease: EASE }} className="flex flex-col gap-4">
              {status === "paid" && (
                <>
                  <LineReveal as="h1" immediate delay={0.2} lines={["Спасибо", "за покупку!"]} className="text-[clamp(40px,5vw,68px)] font-extrabold leading-none" />
                  <p className="max-w-[520px] text-[17px] leading-relaxed text-ink-2">
                    Заказ <b>№ {order?.id}</b> принят и оплачен. Подтверждение и чек отправили на <b>{order?.contacts.email}</b>.
                  </p>
                </>
              )}
              {status === "pending" && (
                <>
                  <h1 className="text-[clamp(36px,5vw,64px)] font-extrabold leading-none">Проверяем статус оплаты</h1>
                  <p className="max-w-[520px] text-[17px] leading-relaxed text-ink-2">Банк ещё не прислал подтверждение. Не оплачивай повторно — страница обновится сама. Если затянется дольше 15 минут, напиши в поддержку.</p>
                </>
              )}
              {status === "failed" && (
                <>
                  <h1 className="text-[clamp(36px,5vw,64px)] font-extrabold leading-none">Оплата не прошла</h1>
                  <p className="max-w-[520px] text-[17px] leading-relaxed text-ink-2">Деньги не списаны, корзина на месте. Можно попробовать ещё раз или вернуться к заказу.</p>
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink href="/checkout">Повторить оплату</ButtonLink>
                    <ButtonLink href="/cart" variant="outline">Вернуться к заказу</ButtonLink>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-2 flex flex-wrap gap-2">
            <ButtonLink href="/catalog" variant="dark" arrow>Продолжить покупки</ButtonLink>
            <ButtonLink href="/account" variant="outline">Мои заказы</ButtonLink>
          </div>
          <span className="text-[14px] text-mute">
            Вопрос по заказу? <Link href="/contacts" className="underline underline-offset-4 text-ink">Напиши в поддержку</Link> — отвечаем в течение часа с 10 до 22.
          </span>
        </div>

        <motion.aside
          aria-label="Детали заказа"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="flex max-w-[460px] flex-[1_1_360px] flex-col gap-3.5 bg-sand p-7 text-[14px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold">Детали заказа{order && ` № ${order.id}`}</span>
            <span className={clsx("px-2.5 py-1.5 text-[12px] font-bold transition-colors duration-500", badge)}>{label}</span>
          </div>
          {order?.items.map((it) => {
            const p = getProduct(it.slug)!;
            return (
              <div key={it.key} className="flex gap-3">
                <div className="relative h-[75px] w-14 flex-none overflow-hidden bg-stone">
                  <Image src={img(p.slug, it.color, "flat")} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <span className="flex-1">
                  {p.name}
                  <br />
                  <span className="text-mute">
                    {FABRICS[it.color].name} · {sizeLabel(it.size)} · {it.qty} шт.
                  </span>
                </span>
                <span className="tabular-nums">{rub(p.price * it.qty)}</span>
              </div>
            );
          })}
          <div className="flex justify-between border-t border-line-2 pt-3">
            <span>{status === "paid" ? "Оплачено" : "К оплате"}</span>
            <b className="tabular-nums">{order && rub(order.total + order.deliveryPrice)}</b>
          </div>
          <div className="flex flex-col gap-1 border-t border-line-2 pt-3">
            <span className="text-mute">Получение</span>
            <span>
              {d.title} · {order?.delivery.city}, {order?.delivery.address}
            </span>
            <span>Ожидаемо: {eta}</span>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}
