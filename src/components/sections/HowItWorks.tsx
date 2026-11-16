"use client";

import { motion } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/motion";

const NODES = [
  { id: "A", x: 60, y: 200 },
  { id: "B", x: 230, y: 90 },
  { id: "C", x: 430, y: 230 },
  { id: "D", x: 620, y: 110 },
];

// Active route path connecting A→B→C→D
const ROUTE = "M60 200 L230 90 L430 230 L620 110";

// Extra mesh links (faint)
const MESH = [
  "M60 200 L430 230",
  "M230 90 L620 110",
  "M60 200 L620 110",
  "M230 90 L430 230",
];

export default function HowItWorks() {
  const { t } = useLang();

  return (
    <section id="how" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute left-1/2 top-1/2 h-96 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading label={t.how.label} title={t.how.title} lead={t.how.lead} />

        <Reveal className="mt-16">
          <div className="card-panel relative mx-auto max-w-4xl overflow-hidden p-4 backdrop-blur sm:p-8">
            {/* header bar */}
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                {t.how.flow}
              </span>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-warm/15" />
                <span className="h-2 w-2 rounded-full bg-warm/15" />
                <span className="h-2 w-2 rounded-full bg-gold/70" />
              </div>
            </div>

            <svg viewBox="0 0 680 320" className="w-full">
              {/* faint mesh links */}
              {MESH.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke="rgba(124,150,182,0.14)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  fill="none"
                />
              ))}

              {/* route underglow */}
              <motion.path
                d={ROUTE}
                fill="none"
                stroke="#e6b84a"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.25"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
              {/* main route, drawn in */}
              <motion.path
                d={ROUTE}
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />

              {/* travelling packet */}
              <motion.circle
                r="8"
                fill="#f3efe2"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <animateMotion dur="3s" repeatCount="indefinite" path={ROUTE} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
              </motion.circle>
              <motion.circle r="5" fill="#e6b84a">
                <animateMotion dur="3s" repeatCount="indefinite" path={ROUTE} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
              </motion.circle>
              <motion.circle r="18" fill="none" stroke="#e6b84a" strokeWidth="1.5" opacity="0.5">
                <animateMotion dur="3s" repeatCount="indefinite" path={ROUTE} />
                <animate attributeName="r" values="10;20;10" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
              </motion.circle>

              {/* nodes */}
              {NODES.map((n, i) => (
                <g key={n.id}>
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r="22"
                    fill="rgba(230,184,74,0.1)"
                    stroke="rgba(230,184,74,0.55)"
                    strokeWidth="1.5"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.25, type: "spring", stiffness: 200 }}
                  />
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r="22"
                    fill="none"
                    stroke="#e6b84a"
                    strokeWidth="1.5"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                  />
                  <circle cx={n.x} cy={n.y} r="9" fill="#e6b84a" filter="url(#glow)" />
                  <circle cx={n.x} cy={n.y} r="4" fill="#f3efe2" />
                  <text x={n.x} y={n.y - 34} textAnchor="middle" className="fill-warm font-mono" fontSize="13" fontWeight="700">
                    {n.id}
                  </text>
                  <text x={n.x} y={n.y + 44} textAnchor="middle" className="fill-slate-400 font-mono" fontSize="9">
                    {t.how.step} {n.id}
                  </text>
                </g>
              ))}

              <defs>
                <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c96b6" />
                  <stop offset="100%" stopColor="#e6b84a" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* legend */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 border-t border-white/5 pt-4">
              <span className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-glow-cyan" />
                {t.how.legendDevice}
              </span>
              <span className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span className="h-px w-6 bg-gradient-to-r from-primary to-accent" />
                {t.how.legendSignal}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
