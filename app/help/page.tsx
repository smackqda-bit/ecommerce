import type { Metadata } from "next";
import HelpView from "./HelpView";

export const metadata: Metadata = { title: "Помощь покупателю", description: "Доставка и оплата, обмен и возврат, размеры и уход, частые вопросы." };

export default function Page() {
  return <HelpView />;
}
