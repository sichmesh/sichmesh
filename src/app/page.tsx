"use client";

import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Meet from "@/components/sections/Meet";
import Vision from "@/components/sections/Vision";
import HowItWorks from "@/components/sections/HowItWorks";
import Experience from "@/components/sections/Experience";
import Status from "@/components/sections/Status";
import AppSection from "@/components/sections/AppSection";
import Join from "@/components/sections/Join";

export default function Page() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <Story />
      <Meet />
      <Vision />
      <HowItWorks />
      <Experience />
      <Status />
      <AppSection />
      <Join />
    </main>
  );
}
