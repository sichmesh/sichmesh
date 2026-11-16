"use client";

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/Section";

const featureIcons = [
  "M4 5h16v11H7l-3 3z", // message
  "M12 3v9m0 0a3 3 0 003-3V6a3 3 0 00-6 0v3a3 3 0 003 3zm-6 0a6 6 0 0012 0M12 18v3", // voice
  "M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z", // location pin (drawn below)
  "M12 2l2 4 4 .6-3 3 .7 4L12 16l-3.7 1.6.7-4-3-3 4-.6z", // sos star
  "M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z", // shield
  "M6 8a3 3 0 100-6 3 3 0 000 6zm12 0a3 3 0 100-6 3 3 0 000 6zM6 22a3 3 0 100-6 3 3 0 000 6zm12 0a3 3 0 100-6 3 3 0 000 6zM6 5h12M6 19h12M5 8v8m14-8v8", // mesh
  "M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15 15 0 010 20a15 15 0 010-20z", // offline globe
  "M4 12h4l3-8 4 16 3-8h2", // relay pulse
];

export default function Vision() {
  const { t } = useLang();

  return (
    <section id="vision" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading label={t.vision.label} title={t.vision.title} lead={t.vision.lead} />

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.vision.features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-ink-700/60 to-ink-800/60 p-7 backdrop-blur transition-colors hover:border-accent/30"
            >
              <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-accent/5">
                <span className="absolute inset-0 rounded-xl bg-accent/10 opacity-0 blur transition-opacity group-hover:opacity-100" />
                <svg viewBox="0 0 24 24" fill="none" className="relative h-6 w-6 text-accent">
                  <path d={featureIcons[i]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-body text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              <span className="mt-auto pt-5 block font-mono text-[10px] text-slate-600">
                0{i + 1}
              </span>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
