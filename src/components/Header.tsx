"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n/LanguageProvider";
import Logo from "@/components/ui/Logo";
import UaFlag from "@/components/ui/UaFlag";

export default function Header() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const HEADER_HEIGHT = 80;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
    window.scrollTo({ top, behavior: "smooth" });
    history.pushState(null, "", href);
    setOpen(false);
  };

  const links = [
    { href: "#vision", label: t.nav.vision },
    { href: "#how", label: t.nav.how },
    { href: "#features", label: t.nav.features },
    { href: "#status", label: t.nav.status },
    { href: "#app", label: t.nav.app },
    { href: "#join", label: t.nav.join },
    { href: "https://flasher.sichmesh.org", label: t.nav.flash },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/60 bg-bg/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="BFU SICH">
          <Logo className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
          <span className="flex items-center gap-2">
            <span className="font-display text-base tracking-[0.12em] text-warm">
              SICH
            </span>
            <UaFlag className="h-[15px] w-auto shrink-0" />
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchor(e, l.href)}
              className="relative whitespace-nowrap font-mono text-xs uppercase tracking-[0.18em] text-dim transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="flex items-center rounded-full border border-line/70 bg-panel/40 p-0.5">
            {(["en", "ua"] as const).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className="relative rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors"
              >
                {lang === code && (
                  <motion.span
                    layoutId="lang-pill"
                    className="absolute inset-0 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={`relative ${
                    lang === code ? "text-bg" : "text-dim"
                  }`}
                >
                  {code === "en" ? "EN" : "UA"}
                </span>
              </button>
            ))}
          </div>

          <a
            href="https://discord.gg/zpVgjRxdQJ"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden whitespace-nowrap rounded-full bg-gold px-4 py-2 text-xs font-semibold text-bg shadow-gold transition-transform hover:scale-105 lg:block"
          >
            {t.nav.cta}
          </a>

          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line/70 lg:hidden"
            aria-label="Menu"
          >
            <div className="space-y-1">
              <span className="block h-0.5 w-4 bg-warm" />
              <span className="block h-0.5 w-4 bg-warm" />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            /* opacity + y only: animating height: "auto" makes framer-motion
               measure the page and restore the old scroll position, which
               cancels the scroll to the tapped section on phones */
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line/50 bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleAnchor(e, l.href)}
                  className="rounded-lg px-3 py-2.5 font-mono text-sm uppercase tracking-wide text-warm/80 hover:bg-panel/50 hover:text-gold"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="https://discord.gg/zpVgjRxdQJ"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-gold px-3 py-2.5 text-center text-sm font-semibold text-bg shadow-gold"
              >
                {t.nav.cta}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
