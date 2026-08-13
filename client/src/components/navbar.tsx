"use client";
import "../styles/navbar.css";
import "../styles/gradients.css";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logos/utmist-logo-small.svg";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/shared/lib/client";
import { ThemeToggle } from "./theme-toggle";

const programLinks = [
  { href: "/startups", label: "MISTic R&D" },
  { href: "/ml-fundamentals", label: "MLF" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isMobileProgramsOpen, setIsMobileProgramsOpen] = useState(false);
  const programsRef = useRef<HTMLLIElement>(null);
  const { user } = useUser();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        programsRef.current &&
        !programsRef.current.contains(event.target as Node)
      ) {
        setIsProgramsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setIsMobileProgramsOpen(false);
  };

  return (
    <>
      <nav className="navbar-container desktop-navbar">
        <Link href="/" passHref>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
            <span className="navbar-logo-text">UTMIST</span>
          </div>
        </Link>

        <ul className="nav-links">
          <li>
            <Link href="/#about-us" className="nav-item">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/projects" className="nav-item">
              Projects
            </Link>
          </li>
          {/* <li>
            <Link href="/blog" className="nav-item">
              Blog
            </Link>
          </li> */}
          <li>
            <Link href="/sponsors" className="nav-item">
              Sponsors
            </Link>
          </li>
          <li>
            <Link href="/events" className="nav-item">
              Events
            </Link>
          </li>
          <li>
            <Link href="/careers" className="nav-item">
              Careers
            </Link>
          </li>
          <li
            ref={programsRef}
            className="nav-dropdown"
            onMouseEnter={() => setIsProgramsOpen(true)}
            onMouseLeave={() => setIsProgramsOpen(false)}
          >
            <button
              type="button"
              className="nav-item nav-dropdown-trigger"
              aria-haspopup="true"
              aria-expanded={isProgramsOpen}
              onClick={() => setIsProgramsOpen((open) => !open)}
            >
              Programs
              <span aria-hidden="true" className="nav-dropdown-caret">
                ▾
              </span>
            </button>
            {isProgramsOpen && (
              <ul className="nav-dropdown-menu" role="menu">
                {programLinks.map((item) => (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      className="nav-dropdown-item"
                      role="menuitem"
                      onClick={() => setIsProgramsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
            {/*<li>*/}
            {/*    <Link href="/departments" className="nav-item">*/}
            {/*        Departments*/}
            {/*    </Link>*/}
            {/*</li>*/}
          <li>
            <Link href={user ? "/profile" : "/auth"} className="nav-button">
              {user ? "Profile" : "Login"}
            </Link>
          </li>
        </ul>
      </nav>

      <nav className="mobile-navbar">
        <div className="mobile-navbar-container flex justify-between items-center px-4 py-3 shadow-md fixed top-0 left-0 right-0 z-50">
          <Link href="/" passHref>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
              <span className="navbar-logo-text">UTMIST</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
              ☰
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mobile-overlay" onClick={closeMobileMenu}>
            <ul
              className="mobile-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <li>
                <Link href="/#about-us" onClick={closeMobileMenu}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" onClick={closeMobileMenu}>
                  Projects
                </Link>
              </li>
              {/* <li>
                <Link href="/blog" onClick={closeMobileMenu}>
                  Blog
                </Link>
              </li> */}
              <li>
                <Link href="/sponsors" onClick={closeMobileMenu}>
                  Sponsors
                </Link>
              </li>
              <li>
                <Link href="/events" onClick={closeMobileMenu}>
                  Events
                </Link>
              </li>
              <li>
                <Link href="/careers" onClick={closeMobileMenu}>
                  Careers
                </Link>
              </li>
              <li className="mobile-nav-dropdown">
                <button
                  type="button"
                  className="mobile-nav-dropdown-trigger"
                  aria-haspopup="true"
                  aria-expanded={isMobileProgramsOpen}
                  onClick={() =>
                    setIsMobileProgramsOpen((open) => !open)
                  }
                >
                  Programs
                  <span aria-hidden="true" className="nav-dropdown-caret">
                    {isMobileProgramsOpen ? "▴" : "▾"}
                  </span>
                </button>
                {isMobileProgramsOpen && (
                  <ul className="mobile-nav-dropdown-menu">
                    {programLinks.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={closeMobileMenu}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <Link
                  href={user ? "/profile" : "/auth"}
                  onClick={closeMobileMenu}
                  className="nav-button"
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
