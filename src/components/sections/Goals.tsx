"use client";

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/Section";
import { RevealGroup, fadeUp } from "@/components/ui/motion";

const icons = [
  "M4 5h16v11H7l-3 3z", // message
  "M12 3v9m0 0a3 3 0 003-3V6a3 3 0 00-6 0v3a3 3 0 003 3zm-6 0a6 6 0 0012 0M12 18v3", // voice
  "M6 8a3 3 0 100-6 3 3 0 000 6zm12 0a3 3 0 100-6 3 3 0 000 6zM6 22a3 3 0 100-6 3 3 0 000 6zm12 0a3 3 0 100-6 3 3 0 000 6zM6 5h12M6 19h12M5 8v8m14-8v8", // mesh
  "M12 3l9 16H3zM12 9v5M12 17h.01", // sos
  "M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11zM12 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z", // location
  "M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15 15 0 010 20a15 15 0 010-20z", // offline
  "M4 7h16M4 12h16M4 17h10", // software
  "M12 2l2 4 4 .6-3 3 .7 4L12 16l-3.7 1.6.7-4-3-3 4-.6z", // hardware
  "M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v4M12 16h.01", // ux
  "M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z", // private
  "M12 15a3 3 0 100-6 3 3 0 000 6zM19 15a3 3 0 100-6 3 3 0 000 6zM5 15a3 3 0 100-6 3 3 0 000 6z", // encrypted
  "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", // community
];

export default function Goals() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading label={t.goals.label} title={t.goals.title} lead={t.goals.lead} />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.goals.items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-ink-700/60 to-ink-800/60 p-7 backdrop-blur transition-colors hover:border-accent/30"
            >
              <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-accent/5">
                <span className="absolute inset-0 rounded-xl bg-accent/10 opacity-0 blur transition-opacity group-hover:opacity-100" />
                <svg viewBox="0 0 24 24" fill="none" className="relative h-6 w-6 text-accent">
                  <path d={icons[i]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-body text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
