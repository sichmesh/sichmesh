"use client";

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionLabel } from "@/components/ui/Section";
import { Reveal, RevealGroup, fadeUp } from "@/components/ui/motion";

// What the grid looks like when it fails
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

export default function Story() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute right-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/10 blur-[140px]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal className="flex justify-center">
          <SectionLabel>{t.story.label}</SectionLabel>
        </Reveal>

        <Reveal>
          <h2 className="mt-6 font-body text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t.story.title}
          </h2>
        </Reveal>

        {/* Problem → what it looks like → solution */}
        <div className="mt-10 space-y-6">
          {t.story.paragraphs.slice(0, 2).map((paragraph, i) => (
            <Paragraph key={i} text={paragraph} i={i} />
          ))}
        </div>

        <RevealGroup className="mt-12 grid grid-cols-2 gap-3 text-left sm:gap-4 lg:grid-cols-4">
          {t.story.cards.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-ink-700/50 p-5 backdrop-blur transition-colors hover:border-red-400/20"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/5 text-red-300/80">
                {icons[i]}
              </div>
              <h3 className="font-body text-base font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.desc}</p>
            </motion.div>
          ))}
        </RevealGroup>

        <div className="mt-12 space-y-6">
          {t.story.paragraphs.slice(2).map((paragraph, i) => (
            <Paragraph key={i} text={paragraph} i={i} />
          ))}
        </div>

        {/* Decorative element */}
        <Reveal>
          <div className="mt-12 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-accent/50" />
            <span className="flex h-2 w-2 rounded-full border border-accent/40 bg-accent/20" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-accent/50" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Paragraph({ text, i }: { text: string; i: number }) {
  return (
    <Reveal>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: i * 0.1 }}
        className="mx-auto max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg"
      >
        {text}
      </motion.p>
    </Reveal>
  );
}
