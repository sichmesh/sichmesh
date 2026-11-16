"use client";

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";

function stateStyle(state: string) {
  const s = state.toLowerCase();
  if (s.includes("complete") || s.includes("заверш"))
    return "border-accent/40 bg-accent/10 text-accent";
  if (s.includes("progress") || s.includes("процес"))
    return "border-steel/50 bg-steel/15 text-steel";
  return "border-line/60 bg-panel/40 text-dim";
}

export default function Status() {
  const { t } = useLang();

  return (
    <section id="status" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute left-0 top-1/3 h-80 w-80 rounded-full bg-primary/10 blur-[130px]" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading label={t.status.label} title={t.status.title} lead={t.status.lead} />

        <div className="relative mt-16">
          {/* vertical track */}
          <div className="absolute left-[18px] top-2 h-[calc(100%-1rem)] w-0.5 rounded-full bg-white/10 md:left-1/2 md:-translate-x-1/2" />
          {/* animated progress fill */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{ originY: 0 }}
            className="absolute left-[18px] top-2 h-[62%] w-0.5 rounded-full bg-gradient-to-b from-gold via-gold to-steel shadow-[0_0_14px_rgba(230,184,74,0.6)] md:left-1/2 md:-translate-x-1/2"
          />
          {/* leading glow head */}
          <motion.div
            initial={{ opacity: 0, top: "0%" }}
            whileInView={{ opacity: 1, top: "62%" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute left-[18px] z-10 h-3 w-3 -translate-x-[5px] rounded-full bg-gold shadow-[0_0_18px_6px_rgba(230,184,74,0.7)] md:left-1/2 md:-translate-x-1/2"
          />

          <div className="space-y-8">
            {t.status.steps.map((step, i) => (
              <Reveal key={i} amount={0.4}>
                <div
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* node dot */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                    <span className="absolute h-10 w-10 rounded-full border border-accent/20" />
                    <motion.span
                      animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
                      className="absolute h-6 w-6 rounded-full border border-accent/40"
                    />
                    <span className="h-3 w-3 rounded-full bg-accent shadow-glow-cyan" />
                  </div>

                  {/* card */}
                  <div
                    className={`card-panel flex-1 p-6 backdrop-blur md:max-w-[42%] ${
                      i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-body text-lg font-semibold text-white">
                        {step.title}
                      </h3>
                      <span
                        className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${stateStyle(
                          step.state
                        )}`}
                      >
                        {step.state}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
