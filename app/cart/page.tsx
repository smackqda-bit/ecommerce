import { Suspense } from "react";
import type { Metadata } from "next";
import CartView from "./CartView";

export const metadata: Metadata = { title: "Корзина" };

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <CartView />
    </Suspense>
  );
}
