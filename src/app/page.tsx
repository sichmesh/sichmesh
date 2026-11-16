"use client";

import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Goals from "@/components/sections/Goals";
import Meet from "@/components/sections/Meet";
import Problem from "@/components/sections/Problem";
import Vision from "@/components/sections/Vision";
import HowItWorks from "@/components/sections/HowItWorks";
import Tech from "@/components/sections/Tech";
import Experience from "@/components/sections/Experience";
import Why from "@/components/sections/Why";
import Status from "@/components/sections/Status";
import Join from "@/components/sections/Join";

export default function Page() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <Story />
      <Meet />
      <Problem />
      <Vision />
      <HowItWorks />
      <Tech />
      <Experience />
      <Why />
      <Goals />
      <Status />
      <Join />
    </main>
  );
}
