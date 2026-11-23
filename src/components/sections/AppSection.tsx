"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";
import AppCards from "@/components/AppCards";

export default function AppSection() {
  const { t } = useLang();

  return (
    <section id="app" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-gold/10 blur-[130px]" />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading label={t.app.label} title={t.app.title} lead={t.app.lead} />
        <Reveal className="mt-14">
          <AppCards text={t.app} />
        </Reveal>
      </div>
    </section>
  );
}
