"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";

export default function Tech() {
  const { t } = useLang();

  return (
    <section className="relative py-16 sm:py-20">
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              {t.tech.label}
            </span>
            <h3 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
              {t.tech.title}
            </h3>
            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
              {t.tech.lead}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
