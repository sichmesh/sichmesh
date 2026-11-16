"use client";

import { useEffect, useRef, useState } from "react";
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

const isDone = (state: string) => {
  const s = state.toLowerCase();
  return s.includes("complete") || s.includes("заверш");
};

export default function Status() {
  const { t } = useLang();
  const track = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLDivElement | null)[]>([]);
  // Track geometry measured from the real dots, so the line starts at the first
  // dot, ends at the last one and the progress stops exactly on the last
  // completed step, whatever the card heights are on this screen.
  const [geo, setGeo] = useState({ first: 0, last: 0, done: 0 });
  const lastDone = t.status.steps.reduce((acc, s, i) => (isDone(s.state) ? i : acc), -1);

  useEffect(() => {
    const box = track.current;
    if (!box) return;
    // centre of a dot relative to the track box; offsetTop ignores the reveal
    // transforms, so the result does not depend on the scroll animation
    const centre = (el: HTMLElement | null | undefined) => {
      if (!el) return 0;
      let y = el.offsetHeight / 2;
      let n: HTMLElement | null = el;
      while (n && n !== box) {
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return y;
    };
    const measure = () => {
      const list = dots.current;
      setGeo({
        first: centre(list[0]),
        last: centre(list[list.length - 1]),
        done: centre(list[Math.max(lastDone, 0)]),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [lastDone, t]);

  return (
    <section id="status" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute left-0 top-1/3 h-80 w-80 rounded-full bg-primary/10 blur-[130px]" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading label={t.status.label} title={t.status.title} lead={t.status.lead} />

        <div ref={track} className="relative mt-16">
          {/* vertical track: first dot to last dot */}
          <div
            style={{ top: geo.first, height: Math.max(geo.last - geo.first, 0) }}
            className="absolute left-[20px] w-0.5 -translate-x-1/2 rounded-full bg-white/10 md:left-1/2"
          />
          {lastDone > 0 && (
            <>
              {/* progress fill: first dot to the last completed one */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: Math.max(geo.done - geo.first, 0) }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                style={{ top: geo.first }}
                className="absolute left-[20px] w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-gold via-gold to-steel shadow-[0_0_14px_rgba(230,184,74,0.6)] md:left-1/2"
              />
              {/* leading glow head, stops on the last completed dot */}
              <motion.div
                initial={{ opacity: 0, top: geo.first }}
                whileInView={{ opacity: 1, top: geo.done }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="absolute left-[20px] z-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_18px_6px_rgba(230,184,74,0.7)] md:left-1/2"
              />
            </>
          )}

          <div className="space-y-8">
            {t.status.steps.map((step, i) => (
              <Reveal key={i} amount={0.4}>
                <div
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* node dot */}
                  <div
                    ref={(el) => {
                      dots.current[i] = el;
                    }}
                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2"
                  >
                    <RadioNode done={isDone(step.state)} delay={i * 0.4} />
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

/** Timeline marker: a small radio node sending out signal waves.
 *  Completed steps are gold, the ones ahead are steel and quieter. */
function RadioNode({ done, delay }: { done: boolean; delay: number }) {
  return (
    <span
      className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-bg ${
        done ? "text-accent" : "text-steel/70"
      }`}
    >
      <svg viewBox="-20 -20 40 40" className="h-10 w-10 overflow-visible" fill="none" aria-hidden>
        {[0, 1].map((k) => (
          <circle key={k} cx="0" cy="-4" r="4" stroke="currentColor" strokeWidth="1" opacity="0">
            <animate attributeName="r" from="4" to="17" dur="2s" begin={`${delay + k}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" from={done ? 0.9 : 0.5} to="0" dur="2s" begin={`${delay + k}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <line x1="0" y1="-4" x2="0" y2="7" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="0" cy="-5" r="3" fill="currentColor" />
        <rect x="-5" y="6" width="10" height="3" rx="1.5" fill="currentColor" opacity="0.7" />
      </svg>
    </span>
  );
}
