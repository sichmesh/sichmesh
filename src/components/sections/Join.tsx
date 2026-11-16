"use client";

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionLabel } from "@/components/ui/Section";
import { Reveal, RevealGroup, fadeUp } from "@/components/ui/motion";
import NetworkCanvas from "@/components/ui/NetworkCanvas";
import ProductRender from "@/components/ui/ProductRender";
import Logo from "@/components/ui/Logo";

export default function Join() {
  const { t } = useLang();

  return (
    <section id="join" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0">
        <NetworkCanvas className="h-full w-full opacity-50" interactive={false} density={0.00006} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/60 to-bg" />
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/12 blur-[140px]" />

      {/* Large low-opacity product render */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 0.08, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        className="pointer-events-none absolute left-1/2 top-1/2 w-[440px] -translate-x-1/2 -translate-y-1/2 sm:w-[560px] lg:w-[680px]"
      >
        <ProductRender alt="" className="h-auto w-full aspect-[3/4] object-contain" />
      </motion.div>

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal className="flex justify-center">
          <SectionLabel>{t.join.label}</SectionLabel>
        </Reveal>

        <Reveal>
          <h2 className="mt-6 font-body text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {t.join.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {t.join.lead}
          </p>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {t.join.points.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="glass rounded-2xl p-5 text-left"
            >
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <p className="mt-2 text-sm leading-snug text-slate-300">{p}</p>
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://discord.gg/zpVgjRxdQJ"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t.join.joinCta}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <a
              href="https://www.youtube.com/@BrainFromUkraine"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full sm:w-auto"
            >
              {t.join.followCta}
            </a>
          </div>
        </Reveal>
      </div>

      {/* Footer */}
      <footer className="relative mt-28 border-t border-line/50 pt-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <Logo className="h-9 w-auto" glow={false} />
            <div className="text-left">
              <p className="font-display text-xs tracking-[0.12em] text-gold">SICH</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                {t.footer.tagline}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim/70">
                {t.footer.developer}
              </p>
            </div>
          </div>
          <p className="font-mono text-[11px] text-dim/70">
            © {new Date().getFullYear()} SICH. {t.footer.rights}
          </p>
        </div>
      </footer>
    </section>
  );
}
