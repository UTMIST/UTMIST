"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { useUser } from "@/shared/lib/client";
import { Button } from "./button";
import "./redesigned-navbar.css";

type NavigationItem = { label: string } & (
  { href: string; children?: never } |
  { href?: string; children: { href: string; label: string }[] }
);

const links: NavigationItem[] = [
  { href: "/#about-us", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events", children: [
    { href: "/eigenai", label: "EigenAI" },
  ] },
  { label: "Programs", children: [
    { href: "/startups", label: "MISTic R&D" },
    { href: "/ml-fundamentals", label: "MLF" },
  ] },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/careers", label: "Careers" },
];

export default function RedesignedNavbar() {
  const { user } = useUser();
  const pathname = usePathname();
  // Keying by pathname closes a menu after Back/Forward navigation as well.
  return <Navigation key={pathname} isHome={pathname === "/"} signedIn={Boolean(user)} />;
}

function Navigation({ isHome, signedIn }: { isHome: boolean; signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const touchNavigation = useRef(false);

  function closeMenus() {
    setOpen(false);
    setDropdown(null);
  }

  return (
    <header className={`redesigned-navbar z-30 font-eigen-body text-white ${isHome ? "absolute inset-x-0 top-0" : "relative bg-[var(--nav-ink)]"}`}>
      {/* One grid positions all three desktop items; equal side columns keep the pill centered. */}
      <nav ref={navigation} aria-label="Main navigation" className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-5 py-5 md:px-10 md:py-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:px-14 xl:py-7"
        onBlur={(event) => {
          // Collapsing a sibling submenu during pointer focus moves the next
          // mobile tap target before click. Close after activation or leaving nav.
          if (!event.currentTarget.contains(event.relatedTarget)) setDropdown(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            if (dropdown) {
              navigation.current?.querySelector<HTMLElement>("[data-dropdown-toggle][aria-expanded=true]")?.focus();
              setDropdown(null);
            } else {
              setOpen(false);
              toggle.current?.focus();
            }
          }
      }}>
          <Link href="/" onClick={closeMenus} className="flex min-h-11 shrink-0 items-center justify-self-start rounded" aria-label="UTMIST home">
            <Image src="/home-redesign/utmist-wordmark.png" alt="UTMIST" width={255} height={78} priority className="h-auto w-32 md:w-36 lg:w-40" />
          </Link>
          <Button ref={toggle} type="button" variant="outline" size="icon" aria-controls="redesigned-navigation-links" aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}
            className="size-11 rounded-full border-[var(--nav-edge)] bg-white/10 text-white hover:scale-100 lg:hidden">
            {open ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <div id="redesigned-navigation-links"
            className={`${open ? "flex" : "hidden"} absolute inset-x-5 top-full max-h-[calc(100svh-7rem)] flex-col gap-4 overflow-y-auto rounded-3xl border border-[var(--nav-edge)] bg-[var(--nav-ink)] p-5 shadow-xl lg:contents`}>
            <div className="redesigned-navbar-links flex flex-col gap-1 lg:min-h-11 lg:w-[min(56vw,620px)] lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:rounded-full lg:border lg:border-[var(--nav-edge)] lg:bg-white/20 lg:px-4 lg:backdrop-blur-xl xl:px-6">
              {links.map(({ href, label, children }) => children ? (
                <div key={label} className="relative flex flex-wrap items-center lg:flex-nowrap"
                  onPointerEnter={(event) => { if (event.pointerType !== "touch") setDropdown(label); }}
                  onPointerLeave={(event) => {
                    if (event.pointerType !== "touch" && !event.currentTarget.contains(document.activeElement)) setDropdown(null);
                  }}>
                  {href ? (
                    <Link href={href} data-dropdown-toggle aria-expanded={dropdown === label}
                      aria-controls={`${label.toLowerCase()}-navigation-dropdown`}
                      onPointerDown={(event) => { touchNavigation.current = event.pointerType === "touch"; }}
                      onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setDropdown(label); }}
                      onKeyDown={(event) => {
                        touchNavigation.current = false;
                        if (event.key === "ArrowDown") { event.preventDefault(); setDropdown(label); }
                      }}
                      onClick={(event) => {
                        // On touch, the first tap reveals the submenu; the next follows the page link.
                        if (touchNavigation.current && dropdown !== label) { event.preventDefault(); setDropdown(label); }
                        else closeMenus();
                      }}
                      className="flex min-h-11 items-center gap-1 rounded-full px-3 text-base tracking-tight hover:bg-white/15 lg:px-2 lg:text-sm xl:px-3 xl:text-base">
                      {label}<ChevronDown size={13} aria-hidden="true" />
                    </Link>
                  ) : (
                    <button type="button" data-dropdown-toggle aria-expanded={dropdown === label}
                      aria-controls={`${label.toLowerCase()}-navigation-dropdown`}
                      onClick={() => setDropdown((current) => current === label ? null : label)}
                      className="flex min-h-11 cursor-pointer items-center justify-center gap-1 rounded-full px-3 text-base tracking-tight hover:bg-white/15 lg:px-2 lg:text-sm xl:px-3 xl:text-base">
                      {label}<ChevronDown size={13} aria-hidden="true" />
                    </button>
                  )}
                  <div id={`${label.toLowerCase()}-navigation-dropdown`} hidden={dropdown !== label}
                    className="w-full pt-2 lg:absolute lg:right-0 lg:top-full lg:w-44">
                    <div className="flex flex-col rounded-2xl border border-[var(--nav-edge)]/50 bg-[var(--nav-ink)] p-2 lg:shadow-xl">
                      {children.map((link) => <Link key={link.href} href={link.href} onClick={closeMenus} className="rounded-lg px-3 py-3 text-sm hover:bg-white/15">{link.label}</Link>)}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={href} href={href} onClick={closeMenus}
                  className="flex min-h-11 items-center rounded-full px-3 py-2.5 text-base tracking-tight lg:py-2 hover:bg-white/15 lg:px-2 lg:text-sm xl:px-3 xl:text-base">{label}</Link>
              ))}
            </div>
            <Button asChild variant="outline" size="lg" className="h-11 min-w-24 rounded-full border-[var(--nav-edge)] bg-white/20 px-6 text-base font-normal text-white backdrop-blur-xl hover:scale-100 hover:border-white hover:bg-white/30 lg:justify-self-end">
              <Link href={signedIn ? "/profile" : "/auth"} onClick={closeMenus}>{signedIn ? "Profile" : "Login"}</Link>
            </Button>
          </div>
      </nav>
    </header>
  );
}
