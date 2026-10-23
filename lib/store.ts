"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { getProduct, type ColorId, type Size } from "@/data/products";

export type CartItem = { key: string; slug: string; color: ColorId; size: Size; qty: number };

export type Contacts = { name: string; phone: string; email: string };
export type Delivery = { city: string; method: "pvz" | "courier"; address: string };

export type Order = {
  id: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  deliveryPrice: number;
  contacts: Contacts;
  delivery: Delivery;
  status: "paid" | "pending" | "failed";
};

export const DELIVERY = {
  pvz: { title: "Пункт выдачи СДЭК", sub: "2–4 дня", price: 350 },
  courier: { title: "Курьер до двери", sub: "1–3 дня, удобный интервал", price: 590 },
} as const;

type State = {
  cart: CartItem[];
  favs: string[];
  contacts: Contacts;
  delivery: Delivery;
  orders: Order[];
  user: { email: string } | null;
  add: (slug: string, color: ColorId, size: Size) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => CartItem | undefined;
  restore: (item: CartItem, index: number) => void;
  toggleFav: (slug: string) => void;
  setContacts: (c: Partial<Contacts>) => void;
  setDelivery: (d: Partial<Delivery>) => void;
  placeOrder: (status?: Order["status"]) => Order;
  setOrderStatus: (id: string, status: Order["status"]) => void;
  login: (email: string) => void;
  logout: () => void;
};

export const cartTotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + (getProduct(i.slug)?.price ?? 0) * i.qty, 0);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      favs: [],
      contacts: { name: "", phone: "", email: "" },
      delivery: { city: "Москва", method: "pvz", address: "" },
      orders: [],
      user: null,
      add: (slug, color, size) =>
        set((s) => {
          const key = `${slug}:${color}:${size}`;
          const ex = s.cart.find((i) => i.key === key);
          return {
            cart: ex
              ? s.cart.map((i) => (i.key === key ? { ...i, qty: Math.min(9, i.qty + 1) } : i))
              : [...s.cart, { key, slug, color, size, qty: 1 }],
          };
        }),
      setQty: (key, qty) => set((s) => ({ cart: s.cart.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(9, qty)) } : i)) })),
      remove: (key) => {
        const item = get().cart.find((i) => i.key === key);
        set((s) => ({ cart: s.cart.filter((i) => i.key !== key) }));
        return item;
      },
      restore: (item, index) =>
        set((s) => {
          const c = [...s.cart];
          c.splice(Math.min(index, c.length), 0, item);
          return { cart: c };
        }),
      toggleFav: (slug) => set((s) => ({ favs: s.favs.includes(slug) ? s.favs.filter((f) => f !== slug) : [...s.favs, slug] })),
      setContacts: (c) => set((s) => ({ contacts: { ...s.contacts, ...c } })),
      setDelivery: (d) => set((s) => ({ delivery: { ...s.delivery, ...d } })),
      placeOrder: (status = "paid") => {
        const s = get();
        const order: Order = {
          id: String(Math.floor(10000 + Math.random() * 89999)),
          createdAt: Date.now(),
          items: s.cart,
          total: cartTotal(s.cart),
          deliveryPrice: DELIVERY[s.delivery.method].price,
          contacts: s.contacts,
          delivery: s.delivery,
          status,
        };
        set({ orders: [order, ...s.orders], cart: status === "failed" ? s.cart : [] });
        return order;
      },
      setOrderStatus: (id, status) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
      login: (email) => set({ user: { email } }),
      logout: () => set({ user: null }),
    }),
    { name: "vne-plana" }
  )
);

/** Защита от расхождения SSR и localStorage: до гидрации отдаём значение по умолчанию */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

export function useCartCount() {
  const n = useStore((s) => s.cart.reduce((a, i) => a + i.qty, 0));
  return useHydrated() ? n : 0;
}

export function useFavCount() {
  const n = useStore((s) => s.favs.length);
  return useHydrated() ? n : 0;
}
