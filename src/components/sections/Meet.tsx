"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionLabel } from "@/components/ui/Section";
import { Reveal, RevealGroup, fadeUp } from "@/components/ui/motion";
import Device3D from "@/components/ui/Device3D";

export default function Meet() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const deviceY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="meet"
      ref={ref}
      className="relative overflow-hidden py-28 sm:py-36"
    >
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* DEVICE — left */}
        <motion.div
          style={{ y: deviceY }}
          className="relative order-2 flex items-center justify-center lg:order-1"
        >
          <div className="absolute h-[60%] w-[60%] rounded-full bg-gold/15 blur-[90px]" />
          <div className="absolute h-[40%] w-[40%] rounded-full bg-steel/18 blur-[70px]" />
          <Reveal className="relative w-full max-w-[380px] lg:max-w-[480px]" amount={0.2}>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Device3D
                initialView="front"
                autoRotate={false}
                alt="BFU SICH device — interactive 3D view"
                /* taller box instead of a bleed: this section clips its own
                   overflow, so the antennas get their room inside the column */
                className="aspect-[5/8] w-full"
              />
            </motion.div>
          </Reveal>
        </motion.div>

        {/* TEXT — right */}
        <div className="order-1 text-center lg:order-2 lg:text-left">
          <Reveal className="flex justify-center lg:justify-start">
            <SectionLabel>{t.meet.label}</SectionLabel>
          </Reveal>
          <Reveal>
            <h2 className="mt-6 font-body text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {t.meet.title}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0">
              {t.meet.body}
            </p>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-2 gap-3">
            {t.meet.specs.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="card-panel bg-card/60 p-5 text-left backdrop-blur"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  {s.k}
                </p>
                <p className="mt-1.5 font-body text-base font-semibold text-white">
                  {s.v}
                </p>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
