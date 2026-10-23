import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, img, products } from "@/data/products";
import ProductView from "./ProductView";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: p.name, description: p.idea, openGraph: { images: [img(p.slug, p.variants[0].color, p.variants[0].shots[0])] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <ProductView slug={p.slug} />
    </Suspense>
  );
}
