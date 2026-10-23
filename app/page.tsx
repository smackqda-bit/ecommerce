import Hero from "@/components/home/Hero";
import { Brand, Collection, Picks, Lookbook, HelpStrip } from "@/components/home/Sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <Brand />
      <Collection />
      <Picks />
      <Lookbook />
      <HelpStrip />
    </main>
  );
}
