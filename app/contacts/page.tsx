"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import PageHead from "@/components/PageHead";
import { Button, Field } from "@/components/ui";
import { EASE, Reveal, RouteLine, Stagger, StaggerItem } from "@/components/motion";

const CHANNELS = [
  { t: "Поддержка", v: "hello@vne-plana.ru", href: "mailto:hello@vne-plana.ru", d: "Вопросы по заказам, обмену и возврату" },
  { t: "Telegram", v: "@vneplana", href: "https://t.me/", d: "Быстрее всего — отвечаем в течение часа" },
  { t: "VK", v: "vk.com/vneplana", href: "https://vk.com/", d: "Новости капсул и закрытые показы" },
  { t: "Телефон", v: "+7 900 000-00-00", href: "tel:+79000000000", d: "Ежедневно с 10:00 до 22:00 по Москве" },
];

export default function ContactsPage() {
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name: "", email: "", msg: "" });
  const [touched, setTouched] = useState(false);
  const errs = {
    name: f.name.trim().length < 2 ? "Как к вам обращаться?" : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email) ? "Проверьте email — сюда придёт ответ" : "",
    msg: f.msg.trim().length < 5 ? "Напишите пару слов о вопросе" : "",
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (errs.name || errs.email || errs.msg) return setTouched(true);
    setSent(true);
  };

  return (
    <main className="pb-24">
      <PageHead crumb="Контакты" eyebrow="Контакты" title={["Точка встречи"]} lede="Напишите в любой удобный канал или оставьте сообщение — ответим в течение часа в рабочее время." />

      <div className="wrap grid gap-16 lg:grid-cols-[1.1fr_1fr]">
        <Stagger className="grid content-start gap-px bg-line sm:grid-cols-2">
          {CHANNELS.map((c) => (
            <StaggerItem key={c.t} className="bg-milk">
              <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group relative isolate flex h-full flex-col gap-2 overflow-hidden p-6 md:p-8">
                <span aria-hidden className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-sand transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
                <span className="font-mono text-[12px] tracking-[0.14em] text-mute">{c.t.toUpperCase()}</span>
                <b className="text-[18px] transition-colors duration-300 group-hover:text-cobalt">{c.v}</b>
                <span className="text-[14px] text-mute">{c.d}</span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="flex flex-col gap-4 bg-sand p-8">
                <RouteLine d="M10 50 C 50 10, 90 60, 150 16" viewBox="0 0 160 60" className="h-[60px] w-[160px] text-ink" start={[10, 50]} end={[150, 16]} duration={1.4} />
                <h2 className="text-[26px] font-bold">Сообщение у нас</h2>
                <p className="text-[15px] text-ink-2">Ответим на {f.email} в течение часа. Если вопрос срочный — пишите в Telegram.</p>
                <button onClick={() => { setSent(false); setF({ name: "", email: "", msg: "" }); setTouched(false); }} className="link-line-on self-start text-[14px] font-semibold">
                  Написать ещё
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -12 }} className="flex flex-col gap-5">
                <h2 className="text-[22px] font-bold">Написать нам</h2>
                <Field label="Имя" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={touched ? errs.name : undefined} />
                <Field label="Email" type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value.trim() })} error={touched ? errs.email : undefined} />
                <label className="flex flex-col gap-1.5 text-[14px] font-semibold">
                  Сообщение
                  <textarea
                    rows={5}
                    value={f.msg}
                    onChange={(e) => setF({ ...f, msg: e.target.value })}
                    className={`resize-y bg-field p-3.5 text-[15px] font-normal outline-none focus:border-ink ${touched && errs.msg ? "border-2 border-error" : "border border-line-2"}`}
                  />
                  {touched && errs.msg && <span className="text-[13px] font-semibold text-error">{errs.msg}</span>}
                </label>
                <Button type="submit" arrow className="self-start">
                  Отправить
                </Button>
                <span className="text-[13px] text-mute">Отправляя форму, вы соглашаетесь с политикой обработки персональных данных.</span>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </main>
  );
}
