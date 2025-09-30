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
      <nav className="hidden lg:flex justify-between items-center py-3 px-6 max-w-[1000px] mx-auto my-10 rounded-full border border-gray3 bg-white relative z-10">
        <Link href="/" passHref>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
            <span className="text-gradient-logo text-2xl font-medium font-[family-name:var(--font-space-grotesk)]">UTMIST</span>
          </div>
        </Link>

        <ul className="flex gap-10 list-none items-center">
          <li>
            <Link href="/#about-us" className="text-gray1 hover:text-primary transition-colors font-extralight">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/projects" className="text-gray1 hover:text-primary transition-colors font-extralight">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-gray1 hover:text-primary transition-colors font-extralight">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/sponsors" className="text-gray1 hover:text-primary transition-colors font-extralight">
              Sponsors
            </Link>
          </li>
          <li>
            <Link href="/events" className="text-gray1 hover:text-primary transition-colors font-extralight">
              Events
            </Link>
          </li>
          <li>
            <Link href="/careers" className="text-gray1 hover:text-primary transition-colors font-extralight">
              Careers
            </Link>
          </li>
          <li>
            <Link href="/ai2" className="text-gray1 hover:text-primary transition-colors font-extralight">
              AI^2
            </Link>
          </li>
          <li>
            <Link href="/ml-fundamentals" className="text-gray1 hover:text-primary transition-colors font-extralight">
              MLF
            </Link>
          </li>
          <li>
            <Link href={user ? "/profile" : "/auth"} className="bg-gradient-to-r from-[#6B66E3] to-[#1E19B1] text-white rounded-[10px] py-1 px-5 hover:opacity-90 hover:scale-105 transition-all inline-block">
              {user ? "Profile" : "Login"}
            </Link>
          </li>
        </ul>
      </nav>

      <nav className="lg:hidden block">
        <div className="flex justify-between items-center px-4 py-3 bg-white shadow-md fixed top-0 left-0 right-0 z-[1001]">
          <Link href="/" passHref>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
              <span className="text-gradient-logo text-2xl font-medium font-[family-name:var(--font-space-grotesk)]">UTMIST</span>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray1 text-2xl z-[100]"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </Button>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-[900]" onClick={() => setIsOpen(false)}>
            <ul className="text-black fixed top-[60px] left-0 right-0 bg-white px-8 py-4 flex flex-col gap-4 shadow-lg z-[1002] -translate-y-2.5 opacity-0 animate-[dropdownFadeSlide_0.2s_ease-out_forwards]">
              <li>
                <Link href="/#about-us" onClick={() => setIsOpen(false)} className="text-gray1 hover:text-primary transition-colors font-extralight">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" onClick={() => setIsOpen(false)} className="text-gray1 hover:text-primary transition-colors font-extralight">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" onClick={() => setIsOpen(false)} className="text-gray1 hover:text-primary transition-colors font-extralight">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sponsors" onClick={() => setIsOpen(false)} className="text-gray1 hover:text-primary transition-colors font-extralight">
                  Sponsors
                </Link>
              </li>
              <li>
                    <Link href="/events" onClick={() => setIsOpen(false)} className="text-gray1 hover:text-primary transition-colors font-extralight">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/careers" onClick={() => setIsOpen(false)} className="text-gray1 hover:text-primary transition-colors font-extralight">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/ai2" onClick={() => setIsOpen(false)} className="text-gray1 hover:text-primary transition-colors font-extralight">
                  AI^2
                </Link>
              </li>
              <li>
                <Link href="/ml-fundamentals" onClick={() => setIsOpen(false)} className="text-gray1 hover:text-primary transition-colors font-extralight">
                  MLF
                </Link>
              </li>
              <li>
                <Link
                  href={user ? "/profile" : "/auth"}
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-[#6B66E3] to-[#1E19B1] text-white rounded-[10px] py-1 px-5 hover:opacity-90 hover:scale-105 transition-all inline-block"
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
