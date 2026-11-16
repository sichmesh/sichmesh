"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import NetworkCanvas from "@/components/ui/NetworkCanvas";
import Device3D from "@/components/ui/Device3D";
import Logo from "@/components/ui/Logo";

export default function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      id="top"
      ref={ref}
      className="noise relative flex min-h-[100svh] min-h-[100dvh] items-center justify-center overflow-hidden pt-16 pb-8 sm:pt-20 sm:pb-12 lg:min-h-screen lg:py-24"
    >
      {/* Layered background */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <NetworkCanvas className="absolute inset-0 h-full w-full" />
      </motion.div>
      <div className="absolute inset-0 grid-bg opacity-70" />
      <div className="absolute left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-gold/15 blur-[140px]" />
      <div className="absolute bottom-0 right-1/4 h-[360px] w-[360px] rounded-full bg-steel/12 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />

      {/* Centered single column: badge -> title -> subtitle -> statement -> device -> CTAs */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-5 text-center sm:gap-6 sm:px-8"
      >
        {/* Large mesh-trident mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-1"
        >
          <Logo className="h-32 w-auto drop-shadow-[0_10px_40px_rgba(230,184,74,0.35)] sm:h-40" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glow-text whitespace-nowrap font-display text-3xl tracking-[0.08em] text-warm min-[340px]:text-4xl min-[420px]:text-5xl sm:text-6xl lg:text-7xl lg:leading-[0.9]"
        >
          <span className="text-gradient">{t.hero.title}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="-mt-1 font-mono text-xs uppercase tracking-[0.35em] text-accent sm:text-sm"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="max-w-xl text-base font-medium leading-relaxed text-slate-200 sm:text-lg"
        >
          {t.hero.statement}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base"
        >
          {t.hero.description}
        </motion.p>

        {/* Device render — centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          /* -z-10: the antennas bleed up out of this box and must pass
             behind the copy above, not over it. */
          className="relative -z-10 flex w-full items-center justify-center"
        >
          {/* stronger device glow, connecting product to the mesh */}
          <div className="absolute h-[70%] w-[70%] rounded-full bg-gold/25 blur-[100px] sm:h-[78%] sm:w-[78%] sm:blur-[120px]" />
          <div className="absolute h-[52%] w-[52%] rounded-full bg-steel/25 blur-[80px] sm:h-[56%] sm:w-[56%] sm:blur-[90px]" />
          {/* gentle float */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex w-full justify-center"
          >
            <Device3D
              initialView="iso"
              bleedTop={0.55}
              alt="BFU SICH off-grid communication device"
              className="h-[46vh] min-h-[340px] w-full max-w-[88vw] sm:h-[54vh] sm:max-w-[480px] lg:h-[52vh] lg:max-w-[560px]"
            />
          </motion.div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a href="#meet" className="btn-gold group w-full sm:w-auto">
            <span className="relative z-10">{t.hero.learnMore}</span>
            <span className="absolute inset-0 -translate-x-full bg-warm/25 transition-transform duration-500 group-hover:translate-x-full" />
          </a>
          <a href="#status" className="btn-ghost w-full sm:w-auto">
            {t.hero.roadmap}
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 xl:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
          {t.hero.scroll}
        </span>
        <div className="flex h-9 w-5 justify-center rounded-full border border-white/20 p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}
