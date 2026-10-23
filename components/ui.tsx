"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion } from "motion/react";
import { forwardRef } from "react";

type Variant = "primary" | "dark" | "outline" | "outline-light" | "light";

const base =
  "group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden px-7 text-[14px] font-semibold tracking-[0.04em] select-none transition-colors duration-500 ease-[var(--ease-out-expo)] disabled:opacity-40 disabled:pointer-events-none";

const look: Record<Variant, string> = {
  primary: "bg-cobalt text-white hover:text-white",
  dark: "bg-ink text-milk hover:text-milk",
  outline: "border border-ink text-ink hover:text-milk",
  "outline-light": "border border-milk/80 text-milk hover:text-ink",
  light: "bg-milk text-ink hover:text-white",
};
const fill: Record<Variant, string> = {
  primary: "bg-ink",
  dark: "bg-cobalt",
  outline: "bg-ink",
  "outline-light": "bg-milk",
  light: "bg-cobalt",
};

function Inner({ children, arrow, variant }: { children: React.ReactNode; arrow?: boolean; variant: Variant }) {
  return (
    <>
      <span
        aria-hidden
        className={clsx(
          "absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform duration-[650ms] ease-[var(--ease-out-expo)] group-hover:scale-y-100",
          fill[variant]
        )}
      />
      <span>{children}</span>
      {arrow && (
        <span aria-hidden className="relative inline-flex w-4 overflow-hidden">
          <span className="inline-block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-[120%]">→</span>
          <span className="absolute inline-block -translate-x-[120%] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0">→</span>
        </span>
      )}
    </>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow,
  className,
  size = "md",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Link href={href} className={clsx(base, look[variant], size === "lg" ? "h-14" : size === "sm" ? "h-11 px-5" : "h-[52px]", className)}>
      <Inner arrow={arrow} variant={variant}>
        {children}
      </Inner>
    </Link>
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; arrow?: boolean; size?: "sm" | "md" | "lg" }
>(function Button({ children, variant = "primary", arrow, className, size = "md", ...rest }, ref) {
  return (
    <button ref={ref} className={clsx(base, look[variant], size === "lg" ? "h-14" : size === "sm" ? "h-11 px-5" : "h-[52px]", className)} {...rest}>
      <Inner arrow={arrow} variant={variant}>
        {children}
      </Inner>
    </button>
  );
});

export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={clsx("group inline-flex items-center gap-2 text-[14px] font-semibold", className)}>
      <span className="link-line-on pb-0.5">{children}</span>
      <span aria-hidden className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">→</span>
    </Link>
  );
}

export function Eyebrow({ children, className, dot }: { children: React.ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={clsx("eyebrow inline-flex items-center gap-2.5 text-mute", className)}>
      {dot && <span className="h-2 w-2 rounded-full bg-cobalt" />}
      {children}
    </span>
  );
}

export function Heart({ on, size = 18 }: { on: boolean; size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={on ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden
      animate={on ? { scale: [1, 1.28, 0.94, 1] } : { scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </motion.svg>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="wrap flex flex-wrap gap-2 pt-5 text-[13px] text-mute">
      {items.map((it, i) => (
        <span key={i} className="flex gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          {it.href ? (
            <Link href={it.href} className="link-line hover:text-ink">
              {it.label}
            </Link>
          ) : (
            <span className="text-ink" aria-current="page">
              {it.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Field({
  label,
  hint,
  error,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-[14px] font-semibold">
      {label}
      <input
        {...rest}
        aria-invalid={!!error}
        className={clsx(
          "h-[52px] bg-field px-3.5 text-[15px] font-normal outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-faint focus:border-ink",
          error ? "border-2 border-error" : "border border-line-2"
        )}
      />
      {error && (
        <motion.span role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] font-semibold text-error">
          {error}
        </motion.span>
      )}
      {hint && <span className="text-[13px] font-normal text-mute">{hint}</span>}
    </label>
  );
}
