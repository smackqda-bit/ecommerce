import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "ВНЕ ПЛАНА — мерч о свободных городских маршрутах", template: "%s — ВНЕ ПЛАНА" },
  description: "Капсула 01 «Маршрут не построен»: худи, футболки, лонгсливы и аксессуары для тех, кто не сверяется с навигатором.",
  metadataBase: new URL("https://vne-plana.vercel.app"),
  openGraph: { images: ["/images/lifestyle/hero.jpg"], locale: "ru_RU", type: "website" },
};

export const viewport: Viewport = { themeColor: "#F4F1EA" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="flex min-h-dvh flex-col">
        <SmoothScroll>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-milk">
            К содержимому
          </a>
          <Header />
          <div id="main" className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
