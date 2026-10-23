"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Breadcrumbs, Button, Field } from "@/components/ui";
import { EASE, LineReveal, RouteLine } from "@/components/motion";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const login = useStore((s) => s.login);
  const saved = useStore((s) => s.contacts.email);
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [ok, setOk] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (saved && !email) setEmail(saved);
  }, [saved, email]);

  useEffect(() => {
    if (step !== "code" || timer <= 0) return;
    const t = setTimeout(() => setTimer((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  const emailErr = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "Похоже, в адресе ошибка — проверьте email" : "";

  const sendCode = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (emailErr) return setTouched(true);
    setStep("code");
    setTimer(59);
    setTimeout(() => refs.current[0]?.focus(), 400);
  };

  const setDigit = (i: number, v: string) => {
    const digits = v.replace(/\D/g, "");
    if (digits.length > 1) {
      const next = [...code];
      digits.slice(0, 6 - i).split("").forEach((d, k) => (next[i + k] = d));
      setCode(next);
      refs.current[Math.min(5, i + digits.length)]?.focus();
      if (next.every(Boolean)) finish();
      return;
    }
    const next = [...code];
    next[i] = digits;
    setCode(next);
    if (digits && i < 5) refs.current[i + 1]?.focus();
    if (next.every(Boolean)) finish();
  };

  const finish = () => {
    setOk(true);
    login(email);
    setTimeout(() => router.push("/account"), 1100);
  };

  return (
    <main className="pb-24">
      <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Вход" }]} />
      <div className="wrap flex justify-center pt-14 md:pt-20">
        <div className="flex w-full max-w-[460px] flex-col gap-6">
          <RouteLine d="M10 50 C 50 10, 90 60, 150 16" viewBox="0 0 160 60" className="h-[60px] w-[160px] text-ink" start={[10, 50]} end={[150, 16]} duration={1.6} />
          <LineReveal as="h1" immediate lines={["Вход по коду"]} className="text-[clamp(34px,4vw,52px)] font-extrabold" />
          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.form key="e" onSubmit={sendCode} noValidate initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.55, ease: EASE }} className="flex flex-col gap-5">
                <p className="text-[15px] leading-relaxed text-ink-2">Без паролей: пришлём шестизначный код на почту. В кабинете — история заказов и их статус.</p>
                <Field label="Email" type="email" autoComplete="email" placeholder="anna@mail.ru" value={email} onChange={(e) => setEmail(e.target.value.trim())} error={touched ? emailErr || undefined : undefined} />
                <Button type="submit" size="lg" arrow>
                  Получить код
                </Button>
              </motion.form>
            ) : (
              <motion.div key="c" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.55, ease: EASE }} className="flex flex-col gap-5">
                <p className="text-[15px] leading-relaxed text-ink-2">
                  Код отправили на <b>{email}</b>.{" "}
                  <button onClick={() => { setStep("email"); setCode(["", "", "", "", "", ""]); }} className="link-line-on">
                    Изменить
                  </button>
                </p>
                <div className="flex gap-2" role="group" aria-label="Код из письма">
                  {code.map((d, i) => (
                    <motion.input
                      key={i}
                      ref={(el) => {
                        refs.current[i] = el;
                      }}
                      value={d}
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      aria-label={`Цифра ${i + 1}`}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && refs.current[i - 1]?.focus()}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0, borderColor: ok ? "#1E3FCC" : d ? "#1C1C1B" : "#BDB6A8" }}
                      transition={{ duration: 0.5, delay: ok ? i * 0.05 : 0.1 + i * 0.04, ease: EASE }}
                      className="h-16 w-full min-w-0 border-2 bg-field text-center text-[26px] font-bold outline-none focus:border-ink"
                    />
                  ))}
                </div>
                <AnimatePresence>
                  {ok && (
                    <motion.span role="status" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-[14px] font-semibold text-cobalt">
                      ✓ Готово, открываем кабинет…
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="text-[13px] text-mute">
                  {timer > 0 ? (
                    `Отправить код ещё раз можно через 0:${String(timer).padStart(2, "0")}`
                  ) : (
                    <button onClick={() => setTimer(59)} className="link-line-on text-ink">
                      Отправить код ещё раз
                    </button>
                  )}
                </span>
                <span className="border border-dashed border-line-2 px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-mute">ДЕМО · ПОДОЙДЁТ ЛЮБОЙ КОД</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
