import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import WhyChoose from "../components/WhyChoose";
import Showcase from "../components/Showcase";
import Community from "../components/Community";
import FAQ from "../components/FAQ";
import ClosingCTA from "../components/ClosingCTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <Hero />
      <Features />
      <HowItWorks />
      <WhyChoose />
      <Showcase />
      <Community />
      <FAQ />
      <ClosingCTA />
      <Footer />
    </main>
  );
}
