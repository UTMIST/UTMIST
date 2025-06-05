"use client";
import "../styles/navbar.css";
import "../styles/gradients.css";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logos/utmist-logo-small.svg";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="navbar-container">
        <Link href="/" passHref>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
            <span className="navbar-logo-text">UTMIST</span>
          </div>
        </Link>

        {/* Full Nav (Desktop only) */}
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
        </ul>

        {/* Hamburger (Mobile only) */}
        <button
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <ul className="mobile-dropdown">
          <li>
            <Link
              href="/#about-us"
              onClick={() => setIsOpen(false)}
              className="nav-item"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              onClick={() => setIsOpen(false)}
              className="nav-item"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="nav-item"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/sponsors"
              onClick={() => setIsOpen(false)}
              className="nav-item"
            >
              Sponsors
            </Link>
          </li>
          <li>
            <Link
              href="/events"
              onClick={() => setIsOpen(false)}
              className="nav-item"
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              href="/careers"
              onClick={() => setIsOpen(false)}
              className="nav-item"
            >
              Careers
            </Link>
          </li>
        </ul>
      )}
    </>
  );
}
