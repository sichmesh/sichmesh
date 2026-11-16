"use client";

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionLabel } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";

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

        <div className="mt-10 space-y-6">
          {t.story.paragraphs.map((paragraph, i) => (
            <Reveal key={i}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="mx-auto max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg"
              >
                {paragraph}
              </motion.p>
            </Reveal>
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
