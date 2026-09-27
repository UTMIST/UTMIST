"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import utmistWordmark from "@/assets/logos/utmist-wordmark-white.png";
import { EigenGlassSurface } from "@/features/public-site/components/eigenai-surfaces";

const navigationLinks = [
  { href: "#about", label: "About" },
  { href: "#speakers", label: "Speakers" },
  { href: "#workshops", label: "Workshops" },
  { href: "#schedule", label: "Schedule" },
  { href: "#venue", label: "Venue" },
];

export function EigenNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 md:px-6 md:pt-5">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 hidden h-36 bg-linear-to-b from-[#06002f]/90 via-[#0c0249]/55 to-transparent md:block"
      />
      <nav
        aria-label="EigenAI"
        className="relative z-10 w-full"
        onBlur={(event) => {
          // This is a disclosure: let Tab leave normally, revealing the page
          // before focus reaches a link that would be behind the overlay.
          if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
        }}
      >
        <div
          data-testid="eigenai-mobile-nav-surface"
          className={`relative z-30 w-full md:hidden ${
            isOpen
              ? "rounded-b-3xl"
              : "bg-[#0c0249]/90 shadow-md backdrop-blur-xl"
          }`}
        >
          {isOpen ? (
            <EigenGlassSurface
              variant="mobile"
              className="pointer-events-none absolute inset-0 rounded-b-3xl before:hidden"
            >
              <span />
            </EigenGlassSurface>
          ) : null}
          <div
            data-testid="eigenai-mobile-nav-bar"
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <Link
              href="/"
              className="relative z-10 flex shrink-0 items-center"
              aria-label="UTMIST home"
            >
              <Image
                src={utmistWordmark}
                alt="UTMIST"
                width={112}
                height={34}
                className="h-auto w-23"
              />
            </Link>

            <button
              ref={toggleRef}
              type="button"
              className="relative z-10 flex size-9 items-center justify-center border-0 bg-transparent text-2xl/none text-white"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="eigenai-mobile-menu"
              onClick={() => setIsOpen((open) => !open)}
            >
              <span aria-hidden="true">☰</span>
            </button>
          </div>

          {isOpen ? (
            <div
              id="eigenai-mobile-menu"
              className="border-t border-white/10 px-5 py-4"
            >
              <ul className="relative z-10 flex flex-col items-start gap-1 text-left">
                {navigationLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-xl px-2 py-2.5 text-sm tracking-[0.04em] text-white/85 transition hover:bg-white/10 hover:text-white"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {!isOpen ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-full h-8 bg-linear-to-b from-[#0c0249]/75 to-transparent"
            />
          ) : null}
        </div>

        <div
          data-testid="eigenai-desktop-nav-layout"
          className="hidden grid-cols-[1fr_auto_1fr] items-center md:grid"
        >
          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-center justify-self-start"
            aria-label="UTMIST home"
          >
            <Image
              src={utmistWordmark}
              alt="UTMIST"
              width={112}
              height={34}
              className="h-auto w-28"
            />
          </Link>

          <EigenGlassSurface
            variant="liquid"
            className="flex items-center justify-self-center rounded-full px-8 py-3"
          >
            <ul className="relative z-10 flex items-center gap-5">
              {navigationLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm tracking-[0.04em] text-white/75 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </EigenGlassSurface>

          <div aria-hidden="true" />
        </div>

        {isOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-10 bg-[#06002f]/70 backdrop-blur-sm md:hidden"
            aria-label="Dismiss navigation menu"
            onClick={closeMenu}
          />
        ) : null}
      </nav>
    </header>
  );
}
