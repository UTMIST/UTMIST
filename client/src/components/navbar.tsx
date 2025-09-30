"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logos/utmist-logo-small.svg";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <>
      <nav className="hidden lg:flex justify-between items-center py-3 px-6 max-w-[1000px] mx-auto my-10 rounded-full border border-[var(--gray3)] bg-white relative z-10">
        <Link href="/" passHref>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
            <span className="[background:var(--gradient-logo)] bg-clip-text [-webkit-text-fill-color:transparent] text-2xl font-medium [font-family:var(--font-space-grotesk)]">UTMIST</span>
          </div>
        </Link>

        <ul className="flex gap-10 list-none">
          <li>
            <Link href="/#about-us" className="text-[var(--gray1)] text-base font-light [font-family:var(--system-font)] hover:text-[var(--secondary)]">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/projects" className="text-[var(--gray1)] text-base font-light [font-family:var(--system-font)] hover:text-[var(--secondary)]">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-[var(--gray1)] text-base font-light [font-family:var(--system-font)] hover:text-[var(--secondary)]">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/sponsors" className="text-[var(--gray1)] text-base font-light [font-family:var(--system-font)] hover:text-[var(--secondary)]">
              Sponsors
            </Link>
          </li>
          <li>
            <Link href="/events" className="text-[var(--gray1)] text-base font-light [font-family:var(--system-font)] hover:text-[var(--secondary)]">
              Events
            </Link>
          </li>
          <li>
            <Link href="/careers" className="text-[var(--gray1)] text-base font-light [font-family:var(--system-font)] hover:text-[var(--secondary)]">
              Careers
            </Link>
          </li>
          <li>
            <Link href="/ai2" className="text-[var(--gray1)] text-base font-light [font-family:var(--system-font)] hover:text-[var(--secondary)]">
              AI^2
            </Link>
          </li>
          <li>
            <Link href="/ml-fundamentals" className="text-[var(--gray1)] text-base font-light [font-family:var(--system-font)] hover:text-[var(--secondary)]">
                MLF
            </Link>
          </li>
          <li>
            <Link href={user ? "/profile" : "/auth"} className="[font-family:var(--system-font)] font-light transition-all duration-200 [background:var(--gradient-b2)] text-white rounded-[10px] py-[0.2rem] px-[1.4rem] cursor-pointer hover:opacity-90 hover:scale-105">
              {user ? "Profile" : "Login"}
            </Link>
          </li>
        </ul>
      </nav>

      <nav className="lg:hidden block">
        <div className="flex justify-between items-center px-4 py-3 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
          <Link href="/" passHref>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
              <span className="[background:var(--gradient-logo)] bg-clip-text [-webkit-text-fill-color:transparent] text-2xl font-medium [font-family:var(--font-space-grotesk)]">UTMIST</span>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-[var(--gray1)] text-2xl z-[100]"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </Button>
        </div>

        {isOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[900]" onClick={() => setIsOpen(false)}>
            <ul className="text-black fixed top-[60px] left-0 right-0 bg-white px-8 py-4 flex flex-col gap-4 shadow-[0_4px_8px_rgba(0,0,0,0.1)] z-[1002] -translate-y-[10px] opacity-0 animate-[dropdownFadeSlide_0.2s_ease-out_forwards]">
              <li>
                <Link href="/#about-us" onClick={() => setIsOpen(false)}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" onClick={() => setIsOpen(false)}>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" onClick={() => setIsOpen(false)}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sponsors" onClick={() => setIsOpen(false)}>
                  Sponsors
                </Link>
              </li>
              <li>
                <Link href="/events" onClick={() => setIsOpen(false)}>
                  Events
                </Link>
              </li>
              <li>
                <Link href="/careers" onClick={() => setIsOpen(false)}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/ai2" onClick={() => setIsOpen(false)}>
                  AI^2
                </Link>
              </li>
              <li>
                <Link href="/ml-fundamentals" onClick={() => setIsOpen(false)}>
                    MLF
                </Link>
              </li>
              <li>
                <Link
                  href={user ? "/profile" : "/auth"}
                  onClick={() => setIsOpen(false)}
                  className="[font-family:var(--system-font)] font-light transition-all duration-200 [background:var(--gradient-b2)] text-white rounded-[10px] py-[0.2rem] px-[1.4rem] cursor-pointer hover:opacity-90 hover:scale-105"
                >
                  {user ? "Profile" : "Login"}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
