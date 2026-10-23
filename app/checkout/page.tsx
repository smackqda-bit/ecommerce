import { Suspense } from "react";
import type { Metadata } from "next";
import CheckoutView from "./CheckoutView";

export const metadata: Metadata = { title: "Оформление заказа" };

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <CheckoutView />
    </Suspense>
  );
}
