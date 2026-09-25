"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import utmistWordmark from "@/assets/logos/utmist-wordmark-white.png";

const navigationLinks = [
  { href: "/#about-us", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Event" },
  { href: "/sponsors", label: "Sponsors" },
];

export function EigenNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
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
        className="pointer-events-none fixed inset-x-0 top-0 hidden h-36 bg-gradient-to-b from-[#06002f]/90 via-[#0c0249]/55 to-transparent md:block"
      />
      <nav
        aria-label="EigenAI"
        className="relative z-10 mx-auto max-w-6xl"
      >
        <div
          data-testid="eigenai-mobile-nav-surface"
          className={`relative z-30 w-full md:hidden ${
            isOpen
              ? "eigenai-mobile-glass rounded-b-3xl"
              : "bg-[#0c0249]/90 shadow-md backdrop-blur-xl"
          }`}
        >
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
                <li className="mt-2 px-2">
                  <Link
                    href="/auth"
                    className="eigenai-login-button eigenai-body relative block w-fit rounded-full px-7 py-2 text-center text-sm/normal font-normal tracking-[-0.01em] text-white"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-full h-8 bg-gradient-to-b from-[#0c0249]/75 to-transparent"
          />
        </div>

        <div className="hidden items-center justify-between gap-4 md:flex">
          <Link
            href="/"
            className="relative z-10 flex shrink-0 items-center gap-2.5"
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

          <div className="eigenai-liquid-glass flex items-center rounded-full px-12 py-3">
            <ul className="relative z-10 flex items-center gap-7">
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
          </div>

          <Link
            href="/auth"
            className="eigenai-login-button eigenai-body relative z-10 shrink-0 rounded-[3.165rem] px-8 py-2 text-sm/normal font-normal tracking-[-0.01em] text-white transition"
          >
            Login
          </Link>
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
