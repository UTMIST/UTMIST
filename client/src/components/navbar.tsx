"use client";
import "../styles/navbar.css";
import "../styles/gradients.css";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logos/utmist-logo-small.svg";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <>
      <nav className="navbar-container desktop-navbar">
        <Link href="/" passHref>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
            <span className="navbar-logo-text">UTMIST</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
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
            <li>
              <Link href="/blog" className="nav-item">
                Blog
              </Link>
            </li>
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
            <li>
              <Link href="/startups" className="nav-item">
                MISTic R&D
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>

      <nav className="mobile-navbar">
        <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 right-0 z-50">
          <Link href="/" passHref>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
              <span className="navbar-logo-text">UTMIST</span>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
              ☰
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mobile-overlay" onClick={() => setIsOpen(false)}>
            <ul className="mobile-dropdown">
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
                <Link href="/startups" onClick={() => setIsOpen(false)}>
                  MISTic R&D
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
