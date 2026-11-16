"use client";

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal, fadeUp, stagger } from "@/components/ui/motion";

function Cross() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-400/70" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none">
      <path d="M5 12l4 4 10-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Why() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 grid-bg opacity-25" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading label={t.why.label} title={t.why.title} />

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Traditional */}
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/5 bg-ink-800/50 p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/20 bg-red-500/5">
                  <Cross />
                </span>
                <h3 className="font-body text-lg font-semibold text-slate-300">
                  {t.why.traditionalTitle}
                </h3>
              </div>
              <motion.ul
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {t.why.traditional.map((item, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                    <Cross />
                    <span className="text-sm text-slate-400">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </Reveal>

          {/* BFU SICH */}
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-b from-primary/10 to-ink-800/50 p-8 shadow-glow">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />
              <div className="relative mb-6 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
                  <Check />
                </span>
                <h3 className="font-body text-lg font-semibold text-white">
                  {t.why.bfuTitle}
                </h3>
              </div>
              <motion.ul
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="relative space-y-3"
              >
                {t.why.bfu.map((item, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex items-center gap-3 rounded-xl border border-accent/10 bg-accent/[0.04] px-4 py-3">
                    <Check />
                    <span className="text-sm text-white">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
