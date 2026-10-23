"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import PageHead from "@/components/PageHead";
import { Button, ButtonLink, Field } from "@/components/ui";
import { EASE, RouteLine } from "@/components/motion";
import { DELIVERY, useHydrated, useStore, type Order } from "@/lib/store";
import { getProduct, img, rub } from "@/data/products";
import { items as itemsWord } from "@/lib/utils";

const STATUS: Record<Order["status"], [string, string]> = {
  paid: ["Оплачен", "bg-ok text-cobalt"],
  pending: ["Ждём банк", "bg-warn text-[#7A4E00]"],
  failed: ["Не оплачен", "bg-[#F7E1DF] text-error"],
};

export default function AccountPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders);
  const contacts = useStore((s) => s.contacts);
  const setContacts = useStore((s) => s.setContacts);
  const setStatus = useStore((s) => s.setOrderStatus);
  const logout = useStore((s) => s.logout);
  const [tab, setTab] = useState<"orders" | "profile">("orders");
  const [open, setOpen] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated || !user) return <main className="min-h-[70vh]" />;

  return (
    <main className="pb-24">
      <PageHead crumb="Личный кабинет" eyebrow={user.email} title={[contacts.name ? `Привет, ${contacts.name.split(" ")[0]}` : "Личный кабинет"]}>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-b border-line">
          <div role="tablist" className="flex gap-6">
            {(
              [
                ["orders", "Мои заказы"],
                ["profile", "Профиль"],
              ] as const
            ).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={clsx("relative h-12 text-[15px] font-semibold transition-colors", tab === k ? "text-ink" : "text-mute hover:text-ink")}>
                {l}
                {tab === k && <motion.span layoutId="acc-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-ink" transition={{ duration: 0.5, ease: EASE }} />}
              </button>
            ))}
          </div>
          <button onClick={() => { logout(); router.push("/"); }} className="link-line-on text-[14px] text-mute">
            Выйти
          </button>
        </div>
      </PageHead>

      <div className="wrap">
        <AnimatePresence mode="wait">
          {tab === "orders" ? (
            <motion.div key="o" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease: EASE }}>
              {orders.length === 0 ? (
                <div className="flex flex-col items-start gap-4 py-10">
                  <RouteLine d="M10 50 C 50 10, 90 60, 150 16" viewBox="0 0 160 60" className="h-[60px] w-[160px] text-ink" start={[10, 50]} end={[150, 16]} duration={1.4} />
                  <h2 className="text-[22px] font-bold">Заказов пока нет</h2>
                  <p className="text-mute">Первый маршрут начинается в каталоге.</p>
                  <ButtonLink href="/catalog" arrow>В каталог</ButtonLink>
                </div>
              ) : (
                <ul className="flex flex-col border-t border-line">
                  {orders.map((o, i) => {
                    const [label, cls] = STATUS[o.status];
                    const isOpen = open === o.id;
                    const qty = o.items.reduce((n, x) => n + x.qty, 0);
                    return (
                      <motion.li key={o.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }} className="border-b border-line">
                        <button onClick={() => setOpen(isOpen ? null : o.id)} aria-expanded={isOpen} className="group flex w-full flex-wrap items-center gap-x-6 gap-y-3 py-5 text-left">
                          <span className="w-28 font-mono text-[13px]">№ {o.id}</span>
                          <span className="text-[14px] text-mute">{new Date(o.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}</span>
                          <span className="flex -space-x-3">
                            {o.items.slice(0, 3).map((it) => (
                              <span key={it.key} className="relative h-12 w-9 overflow-hidden border-2 border-milk bg-stone">
                                <Image src={img(it.slug, it.color, "flat")} alt="" fill sizes="36px" className="object-cover" />
                              </span>
                            ))}
                          </span>
                          <span className="text-[14px]">{itemsWord(qty)}</span>
                          <span className="ml-auto flex items-center gap-4">
                            <span className={clsx("px-2.5 py-1.5 text-[12px] font-bold", cls)}>{label}</span>
                            <b className="tabular-nums">{rub(o.total + o.deliveryPrice)}</b>
                            <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.5, ease: EASE }} aria-hidden>
                              ↓
                            </motion.span>
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.55, ease: EASE }} className="overflow-hidden">
                              <div className="grid gap-6 pb-6 md:grid-cols-2">
                                <div className="flex flex-col gap-3">
                                  {o.items.map((it) => {
                                    const p = getProduct(it.slug)!;
                                    return (
                                      <Link key={it.key} href={`/product/${p.slug}?color=${it.color}`} className="flex items-center gap-3 text-[14px] hover:text-cobalt">
                                        <span className="relative h-[75px] w-14 overflow-hidden bg-stone">
                                          <Image src={img(p.slug, it.color, "flat")} alt="" fill sizes="56px" className="object-cover" />
                                        </span>
                                        <span className="flex-1">{p.name} · {it.size === "ONE" ? "единый" : it.size} · {it.qty} шт.</span>
                                        <span className="tabular-nums">{rub(p.price * it.qty)}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                                <div className="flex flex-col gap-2 bg-sand p-5 text-[14px]">
                                  <span className="text-mute">Получение</span>
                                  <span>{DELIVERY[o.delivery.method].title} · {o.delivery.city}, {o.delivery.address}</span>
                                  <span className="mt-3 text-mute">Статус оплаты (демо)</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {(Object.keys(STATUS) as Order["status"][]).map((k) => (
                                      <button key={k} onClick={() => setStatus(o.id, k)} aria-pressed={o.status === k} className={clsx("h-9 px-3 text-[13px] transition-colors", o.status === k ? "bg-ink text-milk" : "border border-line-2 hover:border-ink")}>
                                        {STATUS[k][0]}
                                      </button>
                                    ))}
                                  </div>
                                  <Link href={`/thanks?order=${o.id}`} className="link-line-on mt-2 self-start">
                                    Страница заказа →
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="p"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE }}
              onSubmit={(e) => {
                e.preventDefault();
                setSaved(true);
                setTimeout(() => setSaved(false), 2200);
              }}
              className="flex max-w-[520px] flex-col gap-5"
            >
              <Field label="Имя и фамилия" value={contacts.name} onChange={(e) => setContacts({ name: e.target.value })} autoComplete="name" />
              <Field label="Телефон" type="tel" value={contacts.phone} onChange={(e) => setContacts({ phone: e.target.value })} autoComplete="tel" />
              <Field label="Email" value={user.email} disabled hint="Email — это ваш логин, изменить его можно через поддержку" />
              <div className="flex items-center gap-4">
                <Button type="submit">Сохранить</Button>
                <AnimatePresence>
                  {saved && (
                    <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[14px] font-semibold text-cobalt">
                      ✓ Сохранено
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
