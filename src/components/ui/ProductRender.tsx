"use client";

import { useEffect, useState } from "react";

/**
 * Official BFU SICH product render.
 *
 * Loads /Front.svg from the public folder. Until that asset is added, it shows
 * a neutral "device pending" frame so layouts stay intact — NO placeholder
 * device is drawn. The moment `public/Front.svg` exists, the real render
 * appears everywhere this component is used, with zero further code changes.
 */
export default function ProductRender({
  className = "",
  alt = "BFU SICH device",
  priority = false,
}: {
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.onload = () => active && setStatus("ok");
    img.onerror = () => active && setStatus("missing");
    img.src = "/Front.svg";
    return () => {
      active = false;
    };
  }, []);

  if (status === "ok") {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src="/Front.svg"
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
      />
    );
  }

  // Neutral pending frame — intentionally NOT a device mockup.
  return (
    <div
      className={`flex h-[44vh] min-h-[300px] w-[280px] items-center justify-center rounded-3xl border border-dashed border-accent/25 bg-ink-700/30 sm:h-[50vh] sm:w-[340px] lg:h-auto lg:min-h-0 lg:w-full ${className}`}
      aria-label={`${alt} (render pending)`}
      role="img"
    >
      <div className="px-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/5">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none">
            <rect x="6" y="2" width="12" height="20" rx="3" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent/70">
          Front.svg
        </p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
          add to /public
        </p>
      </div>
    </div>
  );
}
