"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import ProductRender from "@/components/ui/ProductRender";
import type { DeviceScene, ViewKey } from "@/lib/deviceScene";

/**
 * Interactive 3D SICH device.
 *
 * The three.js scene lives in `@/lib/deviceScene` and is imported lazily, so
 * the library only reaches the browser once the device actually scrolls into
 * view. Rendering is parked whenever the canvas leaves the viewport.
 *
 * If WebGL is unavailable (or the chunk fails to load) the component falls
 * back to the flat `device.webp` product render, so layouts never break.
 */
export default function Device3D({
  className = "",
  initialView = "iso",
  controls = true,
  buttons = true,
  autoRotate = true,
  bleedTop = 0,
  alt = "BFU Electronics device for the SICH network",
}: {
  className?: string;
  initialView?: ViewKey;
  /** Allow drag/zoom. */
  controls?: boolean;
  /** Show the view buttons and the interaction hint under the device. */
  buttons?: boolean;
  autoRotate?: boolean;
  /**
   * Extra canvas height above the layout box, as a fraction of that box.
   * The antennas are two thirds of the product's height, so this is where
   * they go: they keep their full length and rise behind whatever sits
   * above the device instead of being clipped. The caller is responsible
   * for stacking that content on top (see Hero / Meet).
   */
  bleedTop?: number;
  alt?: string;
}) {
  const { t } = useLang();
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<DeviceScene | null>(null);

  const [view, setView] = useState<ViewKey>(initialView);
  const [spin, setSpin] = useState(autoRotate);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let disposed = false;
    let started = false;
    let visible = false;

    const boot = async () => {
      // WebGL check first — no point pulling in three.js without it
      try {
        const probe = document.createElement("canvas");
        if (!probe.getContext("webgl2") && !probe.getContext("webgl")) throw new Error("no webgl");
      } catch {
        setState("failed");
        return;
      }
      try {
        const { createDeviceScene } = await import("@/lib/deviceScene");
        if (disposed || !host.current) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        scene.current = createDeviceScene(host.current, {
          view: initialView,
          autoRotate: autoRotate && !reduce,
          interactive: controls,
          onUserInput: () => setSpin(false),
        });
        if (reduce) setSpin(false);
        scene.current.setActive(visible);
        setState("ready");
      } catch {
        setState("failed");
      }
    };

    // boot on first intersection, then use the same observer to park rendering
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !started) {
          started = true;
          void boot();
        }
        scene.current?.setActive(visible);
      },
      { rootMargin: "200px" }
    );
    io.observe(el);

    return () => {
      disposed = true;
      io.disconnect();
      scene.current?.dispose();
      scene.current = null;
    };
  }, [initialView, autoRotate, controls]);

  useEffect(() => {
    scene.current?.setAutoRotate(spin);
  }, [spin]);

  const pick = useCallback((v: ViewKey) => {
    setView(v);
    setSpin(false);
    scene.current?.setView(v);
  }, []);

  if (state === "failed") {
    return <ProductRender alt={alt} className={`h-full w-full object-contain ${className}`} />;
  }

  const views: { key: ViewKey; label: string }[] = [
    { key: "front", label: t.device.front },
    { key: "back", label: t.device.back },
    { key: "edge", label: t.device.edge },
    { key: "iso", label: t.device.iso },
  ];

  const chip =
    "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-200";
  const off = "border-white/10 bg-white/[0.04] text-slate-400 hover:border-accent/40 hover:text-warm";
  const on = "border-accent/60 bg-accent/15 text-accent";

  return (
    <div className={`flex flex-col ${className}`}>
      {/* The box below reserves the layout height; the canvas inside it may
          extend above that box so the antennas stay whole. */}
      <div className="relative min-h-0 w-full flex-1">
        <div
          ref={host}
          role="img"
          aria-label={alt}
          style={{ top: `-${Math.round(bleedTop * 100)}%` }}
          className={`absolute inset-x-0 bottom-0 transition-opacity duration-700 ${
            state === "ready" ? "opacity-100" : "opacity-0"
          } ${controls ? "cursor-grab active:cursor-grabbing" : ""}`}
        />
      </div>

      {controls && buttons && (
        <div className="mt-4 flex shrink-0 flex-col items-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {views.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => pick(v.key)}
                aria-pressed={view === v.key}
                className={`${chip} ${view === v.key ? on : off}`}
              >
                {v.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSpin((s) => !s)}
              aria-pressed={spin}
              className={`${chip} ${spin ? on : off}`}
            >
              {t.device.spin}
            </button>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">
            {t.device.hint}
          </p>
        </div>
      )}
    </div>
  );
}
