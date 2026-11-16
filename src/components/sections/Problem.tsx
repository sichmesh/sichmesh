"use client";

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, fadeUp } from "@/components/ui/motion";

const icons = [
  // No signal
  <svg key="0" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path d="M3 21h18M6 18v-3M11 18v-7M16 18v-2M21 18V5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>,
  // No internet
  <svg key="1" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path d="M5 12a14 14 0 0114 0M2 8.5a20 20 0 0120 0M8.5 15.5a8 8 0 017 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="19" r="1.1" fill="currentColor" />
  </svg>,
  // Infrastructure failure
  <svg key="2" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path d="M12 3l3 6 6 .9-4.5 4.2 1.1 6L12 17.3 6.4 20l1.1-6L3 9.9 9 9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity="0.4" />
    <path d="M13 7l-2 5h3l-2 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Remote
  <svg key="3" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path d="M3 19l5-9 4 6 3-4 6 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="17" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
];

export default function Problem() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute left-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-red-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading label={t.problem.label} title={t.problem.title} lead={t.problem.lead} />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.problem.items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-ink-700/50 p-7 backdrop-blur transition-colors hover:border-red-400/20"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/5 text-red-300/80">
                {icons[i]}
              </div>
              <h3 className="font-body text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-500/5 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </RevealGroup>

        {/* Failing signal animation */}
        <Reveal className="mt-16">
          <div className="relative mx-auto flex h-24 max-w-2xl items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-ink-800/50">
            <svg viewBox="0 0 600 80" className="h-full w-full" preserveAspectRatio="none">
              <motion.path
                d="M0 40 Q50 40 75 40 T150 40 200 15 220 65 240 25 260 55 280 40 T600 40"
                fill="none"
                stroke="rgba(255,110,92,0.5)"
                strokeWidth="1.5"
                animate={{ pathLength: [0, 1], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </svg>
            <span className="absolute font-mono text-[10px] uppercase tracking-[0.3em] text-red-300/60">
              signal lost
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
