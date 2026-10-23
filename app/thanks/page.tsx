import { Suspense } from "react";
import type { Metadata } from "next";
import ThanksView from "./ThanksView";

export const metadata: Metadata = { title: "Статус заказа" };

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ThanksView />
    </Suspense>
  );
}
