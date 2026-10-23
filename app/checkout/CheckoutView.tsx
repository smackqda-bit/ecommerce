"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import clsx from "clsx";
import { FABRICS, getProduct, img, rub, sizeLabel } from "@/data/products";
import { DELIVERY, cartTotal, useHydrated, useStore, type Order } from "@/lib/store";
import { Breadcrumbs, Button, ButtonLink, Field } from "@/components/ui";
import { EASE, LineReveal } from "@/components/motion";

const STEPS = ["Контакты", "Получение", "Проверка и оплата"];
const PVZ = [
  { id: "a", addr: "ул. Покровка, 17", hours: "ежедневно 10:00–21:00", x: 30, y: 42 },
  { id: "b", addr: "Чистопрудный бульвар, 12к2", hours: "ежедневно 09:00–22:00", x: 58, y: 30 },
  { id: "c", addr: "ул. Маросейка, 6/8", hours: "пн–сб 10:00–20:00", x: 46, y: 66 },
];

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const phoneOk = (v: string) => v.replace(/\D/g, "").length >= 11;

function formatPhone(v: string) {
  let d = v.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
  let out = "+7";
  if (p[0]) out += " " + p[0];
  if (p[1]) out += " " + p[1];
  if (p[2]) out += "-" + p[2];
  if (p[3]) out += "-" + p[3];
  return out;
}

export default function CheckoutView() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useStore();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [touched, setTouched] = useState(false);
  const [pvz, setPvz] = useState("a");
  const [agree, setAgree] = useState(true);
  const [paying, setPaying] = useState(false);
  const [scenario, setScenario] = useState<Order["status"]>("paid");

  const items = hydrated ? s.cart : [];
  const total = cartTotal(items);
  const d = DELIVERY[s.delivery.method];
  const errs = {
    name: s.contacts.name.trim().length < 2 ? "Укажи имя — так курьер поймёт, кому отдать заказ" : "",
    phone: !phoneOk(s.contacts.phone) ? "Нужен номер из 11 цифр, например +7 900 000-00-00" : "",
    email: !s.contacts.email ? "Укажи email — пришлём туда чек" : !emailOk(s.contacts.email) ? `Похоже, в адресе не хватает домена: например, ${s.contacts.email.split("@")[0] || "anna"}@mail.ru` : "",
    city: !s.delivery.city.trim() ? "Укажи город" : "",
    address: s.delivery.method === "courier" && s.delivery.address.trim().length < 5 ? "Укажи улицу, дом и квартиру" : "",
  };
  const stepValid = step === 1 ? !errs.name && !errs.phone && !errs.email : step === 2 ? !errs.city && !errs.address : agree;
  const pvzObj = PVZ.find((x) => x.id === pvz)!;

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    setTouched(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => {
    if (!stepValid) return setTouched(true);
    go(step + 1);
  };
  const pay = () => {
    if (!agree) return setTouched(true);
    setPaying(true);
    if (s.delivery.method === "pvz") s.setDelivery({ address: `${pvzObj.addr}` });
    setTimeout(() => {
      const order = s.placeOrder(scenario);
      router.push(`/thanks?order=${order.id}`);
    }, 1500);
  };

  if (hydrated && items.length === 0 && !paying) {
    return (
      <main className="wrap flex flex-1 flex-col items-center justify-center gap-4 py-28 text-center">
        <h1 className="text-[28px] font-bold">Оформлять пока нечего</h1>
        <p className="text-mute">Корзина пуста — загляните в каталог.</p>
        <ButtonLink href="/catalog" arrow>В каталог</ButtonLink>
      </main>
    );
  }

  const err = (k: keyof typeof errs) => (touched ? errs[k] : "") || undefined;

  return (
    <main className="pb-24">
      <Breadcrumbs items={[{ href: "/", label: "Главная" }, { href: "/cart", label: "Корзина" }, { label: "Оформление заказа" }]} />
      <div className="wrap flex flex-col gap-8 pt-7">
        <div className="flex flex-col gap-2">
          <LineReveal as="h1" immediate lines={["Оформление заказа"]} className="text-[clamp(32px,4.2vw,56px)] font-extrabold" />
          <span className="text-[14px] text-mute">Без регистрации — введённые данные сохраняются, если вернёшься на шаг назад.</span>
        </div>

        <ol aria-label="Шаги" className="flex flex-wrap items-center gap-3">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const cur = n === step;
            return (
              <li key={label} className="flex items-center gap-3">
                <button onClick={() => n < step && go(n)} aria-current={cur ? "step" : undefined} disabled={n > step} className={clsx("flex h-11 items-center gap-2.5 text-[14px]", cur ? "font-bold" : "font-medium", n > step ? "text-faint" : "text-ink")}>
                  <span className={clsx("relative flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold transition-colors duration-500", cur ? "bg-cobalt text-white" : done ? "bg-ink text-milk" : "border border-line-2 text-faint")}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={done ? "d" : "n"} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.3 }}>
                        {done ? "✓" : n}
                      </motion.span>
                    </AnimatePresence>
                    {cur && <span className="pulse-dot absolute inset-0 rounded-full" />}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
                {i < 2 && (
                  <span aria-hidden className="relative h-0.5 w-8 sm:w-12">
                    <span className="absolute inset-0 border-t-2 border-dashed border-line-2" />
                    <motion.span className="absolute inset-0 origin-left border-t-2 border-ink" initial={false} animate={{ scaleX: done ? 1 : 0 }} transition={{ duration: 0.8, ease: EASE }} />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-start gap-12">
          <div className="relative min-w-0 max-w-[720px] flex-[999_1_560px]">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: 32 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -32 * dir }}
                transition={{ duration: 0.55, ease: EASE }}
                className="flex flex-col gap-5"
              >
                {step === 1 && (
                  <>
                    <h2 className="text-[22px] font-bold">1. Контакты</h2>
                    <Field label="Имя и фамилия" autoComplete="name" placeholder="Анна Смирнова" value={s.contacts.name} onChange={(e) => s.setContacts({ name: e.target.value })} error={err("name")} />
                    <Field
                      label="Телефон"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+7 900 000-00-00"
                      value={s.contacts.phone}
                      onChange={(e) => s.setContacts({ phone: e.target.value ? formatPhone(e.target.value) : "" })}
                      error={err("phone")}
                      hint="Для связи по доставке"
                    />
                    <Field label="Email" type="email" autoComplete="email" placeholder="anna@mail.ru" value={s.contacts.email} onChange={(e) => s.setContacts({ email: e.target.value.trim() })} error={err("email")} hint="Пришлём сюда чек и статус заказа" />
                    <Button onClick={next} arrow className="self-start">
                      Далее: получение
                    </Button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="text-[22px] font-bold">2. Получение</h2>
                    <Field label="Город" value={s.delivery.city} onChange={(e) => s.setDelivery({ city: e.target.value })} error={err("city")} autoComplete="address-level2" />
                    <fieldset className="flex flex-col gap-2.5">
                      <legend className="mb-2.5 text-[14px] font-semibold">Способ получения</legend>
                      {(Object.keys(DELIVERY) as (keyof typeof DELIVERY)[]).map((k) => {
                        const on = s.delivery.method === k;
                        return (
                          <label key={k} className={clsx("relative flex cursor-pointer items-center gap-3 p-4 text-[14px] transition-colors", !on && "border border-line-2 hover:border-ink")}>
                            {on && <motion.span layoutId="dlv" className="absolute inset-0 border-2 border-ink" transition={{ duration: 0.5, ease: EASE }} />}
                            <input type="radio" name="dlv" checked={on} onChange={() => s.setDelivery({ method: k })} className="relative h-[18px] w-[18px] accent-ink" />
                            <span className="relative flex flex-1 flex-col gap-0.5">
                              <b>{DELIVERY[k].title}</b>
                              <span className="text-[13px] text-mute">{DELIVERY[k].sub}</span>
                            </span>
                            <span className="relative font-semibold">{rub(DELIVERY[k].price)}</span>
                          </label>
                        );
                      })}
                    </fieldset>
                    <AnimatePresence mode="wait" initial={false}>
                      {s.delivery.method === "pvz" ? (
                        <motion.div key="pvz" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.5, ease: EASE }} className="flex flex-col gap-2 overflow-hidden">
                          <span className="text-[14px] font-semibold">Пункт выдачи</span>
                          <div className="relative h-[240px] overflow-hidden bg-stone">
                            <svg className="absolute inset-0 h-full w-full text-line-2" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
                              <path d="M0 30 L100 22 M0 62 L100 70 M22 0 L30 100 M70 0 L62 100 M0 90 C 30 80, 60 95, 100 84" stroke="currentColor" strokeWidth="2.4" vectorEffect="non-scaling-stroke" fill="none" />
                              <path d="M10 0 C 25 30, 50 40, 90 100" stroke="#F4F1EA" strokeWidth="10" vectorEffect="non-scaling-stroke" fill="none" />
                            </svg>
                            <span className="absolute left-3 top-3 font-mono text-[11px] tracking-[0.14em] text-mute">{s.delivery.city.toUpperCase() || "ГОРОД"} · СДЭК</span>
                            {PVZ.map((x) => (
                              <button
                                key={x.id}
                                onClick={() => setPvz(x.id)}
                                aria-label={`Пункт: ${x.addr}`}
                                className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                                style={{ left: `${x.x}%`, top: `${x.y}%` }}
                              >
                                <motion.span
                                  animate={{ scale: pvz === x.id ? 1.25 : 1 }}
                                  transition={{ duration: 0.4, ease: EASE }}
                                  className={clsx("h-3.5 w-3.5 rounded-full shadow-[0_0_0_4px_var(--color-milk)]", pvz === x.id ? "pulse-dot bg-cobalt" : "bg-ink")}
                                />
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between gap-3 border-2 border-ink px-4 py-3.5 text-[14px]">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span key={pvz} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                                <b>{pvzObj.addr}</b>
                                <br />
                                <span className="text-mute">{pvzObj.hours}</span>
                              </motion.span>
                            </AnimatePresence>
                            <span className="text-[13px] text-mute">Выберите точку на карте</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key="courier" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden p-0.5">
                          <Field label="Адрес" autoComplete="street-address" placeholder="Улица, дом, квартира" value={s.delivery.address} onChange={(e) => s.setDelivery({ address: e.target.value })} error={err("address")} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => go(1)}>
                        ← Назад
                      </Button>
                      <Button onClick={next} arrow>
                        Далее: проверка и оплата
                      </Button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2 className="text-[22px] font-bold">3. Проверка и оплата</h2>
                    <div className="border-t border-line">
                      <div className="flex justify-between gap-3 border-b border-line py-3.5 text-[14px]">
                        <span>
                          <span className="text-mute">Контакты</span>
                          <br />
                          {s.contacts.name} · {s.contacts.phone} · {s.contacts.email}
                        </span>
                        <button onClick={() => go(1)} className="link-line-on self-start text-[13px]">Изменить</button>
                      </div>
                      <div className="flex justify-between gap-3 border-b border-line py-3.5 text-[14px]">
                        <span>
                          <span className="text-mute">Получение</span>
                          <br />
                          {d.title} · {s.delivery.city}, {s.delivery.method === "pvz" ? pvzObj.addr : s.delivery.address} · {d.sub}
                        </span>
                        <button onClick={() => go(2)} className="link-line-on self-start text-[13px]">Изменить</button>
                      </div>
                    </div>
                    <fieldset>
                      <legend className="mb-2.5 text-[14px] font-semibold">Способ оплаты</legend>
                      <label className="flex items-center gap-3 border-2 border-ink p-4 text-[14px]">
                        <input type="radio" checked readOnly className="h-[18px] w-[18px] accent-ink" />
                        <b>Банковская карта онлайн</b>
                        <span className="ml-auto text-[13px] text-mute">МИР, Visa, Mastercard</span>
                      </label>
                    </fieldset>
                    <label className="flex cursor-pointer items-start gap-2.5 text-[14px] leading-normal">
                      <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-[18px] w-[18px] flex-none accent-ink" />
                      <span>
                        Согласен(на) с{" "}
                        <Link href="/terms" className="underline underline-offset-4">условиями продажи</Link> и{" "}
                        <Link href="/privacy" className="underline underline-offset-4">политикой обработки данных</Link>
                      </span>
                    </label>
                    {touched && !agree && <span role="alert" className="-mt-3 text-[13px] font-semibold text-error">Без согласия оформить заказ не получится</span>}

                    <div className="flex flex-wrap items-center gap-2 border border-dashed border-line-2 px-4 py-3 text-[13px] text-mute">
                      <span className="font-mono text-[11px] tracking-[0.14em]">ДЕМО · ОТВЕТ БАНКА:</span>
                      {(
                        [
                          ["paid", "оплачено"],
                          ["pending", "ожидание"],
                          ["failed", "ошибка"],
                        ] as const
                      ).map(([k, l]) => (
                        <button key={k} onClick={() => setScenario(k)} aria-pressed={scenario === k} className={clsx("h-8 px-2.5 transition-colors", scenario === k ? "bg-ink text-milk" : "hover:text-ink")}>
                          {l}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={pay}
                      disabled={paying}
                      className="group relative isolate flex h-14 items-center justify-center overflow-hidden bg-cobalt text-[16px] font-semibold text-white"
                    >
                      <span aria-hidden className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink transition-transform duration-[650ms] ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
                      <AnimatePresence mode="wait" initial={false}>
                        {paying ? (
                          <motion.span key="p" className="flex items-center gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <span className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-white" animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }} />
                              ))}
                            </span>
                            Связываемся с банком
                          </motion.span>
                        ) : (
                          <motion.span key="i" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                            Оплатить {rub(total + d.price)}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    <span className="text-[13px] leading-normal text-mute">Откроется защищённая страница платёжного сервиса. Данные карты вводятся там, мы их не видим и не сохраняем. В этом портфолио-проекте оплата имитируется.</span>
                    <Button variant="outline" onClick={() => go(2)} className="self-start">
                      ← Назад
                    </Button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <aside aria-label="Ваш заказ" className="flex max-w-[400px] flex-[1_1_320px] flex-col gap-3.5 bg-sand p-6 lg:sticky lg:top-24">
            <span className="text-[16px] font-bold">Ваш заказ</span>
            {items.map((it) => {
              const p = getProduct(it.slug)!;
              return (
                <div key={it.key} className="flex gap-3 text-[14px]">
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
                  <span className="whitespace-nowrap tabular-nums">{rub(p.price * it.qty)}</span>
                </div>
              );
            })}
            <div className="flex justify-between border-t border-line-2 pt-3 text-[14px]">
              <span>Товары</span>
              <span className="tabular-nums">{rub(total)}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span>Доставка</span>
              <span>{step >= 2 ? rub(d.price) : "после выбора способа"}</span>
            </div>
            <div className="flex justify-between border-t border-line-2 pt-3 text-[18px] font-bold">
              <span>Итого</span>
              <span className="tabular-nums">{rub(total + (step >= 2 ? d.price : 0))}</span>
            </div>
            <Link href="/cart" className="link-line-on self-start text-[13px]">
              Изменить состав в корзине
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
