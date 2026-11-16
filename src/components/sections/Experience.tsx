"use client";

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/Section";
import { RevealGroup, fadeUp } from "@/components/ui/motion";
import ProductRender from "@/components/ui/ProductRender";

const icons = [
  "M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3zm-6-3a6 6 0 0012 0M12 17v4m-4 0h8", // voice
  "M4 5h16v11H8l-4 4z", // message
  "M3 6h18M3 12h18M3 18h12", // channels
  "M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11zM12 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z", // gps
  "M12 3l9 16H3zM12 9v5M12 17h.01", // alert
  "M6 8a3 3 0 100-6 3 3 0 000 6zm12 14a3 3 0 100-6 3 3 0 000 6zM6 22a3 3 0 100-6 3 3 0 000 6zm12-14a3 3 0 100-6 3 3 0 000 6zM8 6l8 12M16 6L8 18", // autonomous
];

export default function Experience() {
  const { t } = useLang();

  return (
    <section id="features" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute right-1/4 top-0 h-80 w-80 rounded-full bg-accent/10 blur-[130px]" />

      {/* Floating decorative product render */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.12 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute -right-16 top-1/4 hidden w-[280px] lg:block xl:w-[340px]"
      >
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <ProductRender alt="" className="h-auto w-full aspect-[3/4] object-contain" />
        </motion.div>
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading label={t.experience.label} title={t.experience.title} />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.experience.cards.map((c, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-ink-700/70 to-ink-800/40 p-8 backdrop-blur"
            >
              {/* hover glow sweep */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 opacity-0 transition-opacity duration-500 group-hover:from-primary/5 group-hover:to-accent/10 group-hover:opacity-100" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/10 to-transparent">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-accent">
                  <path d={icons[i]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="absolute -inset-1 rounded-2xl bg-accent/20 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
              </div>

              <h3 className="relative mt-6 font-body text-xl font-semibold text-white">
                {c.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
                {c.desc}
              </p>

              <div className="relative mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent/70 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="h-px w-6 bg-accent/60" />
                active
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
