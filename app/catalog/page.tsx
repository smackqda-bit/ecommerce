import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogView from "./CatalogView";

export const metadata: Metadata = { title: "Каталог", description: "Капсула 01 «Маршрут не построен»: футболки, худи, лонгсливы и аксессуары." };

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <CatalogView />
    </Suspense>
  );
}
