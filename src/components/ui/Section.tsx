"use client";

import { Reveal } from "./motion";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
        {children}
      </span>
    </div>
  );
}

export function SectionHeading({
  label,
  title,
  lead,
  align = "center",
}: {
  label: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <div className={align === "center" ? "flex justify-center" : ""}>
        <SectionLabel>{label}</SectionLabel>
      </div>
      <h2 className="mt-6 font-body text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {lead && (
        <p className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
          {lead}
        </p>
      )}
    </Reveal>
  );
}
