import type { Metadata } from "next";
import AboutView from "./AboutView";

export const metadata: Metadata = { title: "О бренде", description: "Идея и философия ВНЕ ПЛАНА — мерч о свободных городских маршрутах." };

export default function Page() {
  return <AboutView />;
}
