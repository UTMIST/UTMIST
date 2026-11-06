import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/logos/utmist-logo-small.svg";
import github from "@/assets/logos/github.svg";
import linkedin from "@/assets/logos/linkedin.svg";
import discord from "@/assets/logos/discord.svg";
import instagram from "@/assets/logos/instagram.svg";
import medium from "@/assets/logos/medium.svg";
import youtube from "@/assets/logos/youtube.svg";
import { IconButton } from "./icon-button";
import { ContentContainer } from "./content-container";
import "@/styles/footer.css";

const socials = [
  { name: "Discord", href: "https://discord.com/invite/88mSPw8", icon: discord },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/utmist/", icon: linkedin },
  { name: "Instagram", href: "https://www.instagram.com/uoft_utmist/", icon: instagram },
  { name: "YouTube", href: "https://www.youtube.com/@UTMIST", icon: youtube },
  { name: "GitHub", href: "https://github.com/UTMIST", icon: github },
  { name: "Medium", href: "https://medium.com/demistify", icon: medium },
];

export default function Footer({ variant = "legacy" }: { variant?: "legacy" | "standard" | "academics" }) {
  if (variant === "academics") {
    return (
      <footer data-appearance="academics" data-ui-tone="dark" className="ui-surface relative bg-black py-16 font-eigen-body text-white lg:min-h-[329px] lg:py-20">
        <Image src="/academics-redesign/footer.png" alt="" fill sizes="100vw" className="object-cover" />
        <ContentContainer className="relative flex max-w-[1356px] flex-col justify-between gap-10 md:flex-row md:items-center">
          <div>
            <Link href="/" className="inline-block rounded" aria-label="UTMIST home">
              <Image src="/home-redesign/utmist-wordmark.png" alt="UTMIST" width={332} height={101} className="h-auto w-[260px] max-w-full lg:w-[332px]" />
            </Link>
            <p className="mt-4 max-w-[360px] text-lg leading-snug lg:text-xl">North America’s Largest Undergraduate Machine Learning Club</p>
          </div>
          <ul className="flex flex-wrap gap-3">
            {socials.map(({ name, href }) => <li key={name}>
              <IconButton asChild tone="dark" aria-label={`UTMIST on ${name}`}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Image src="/academics-redesign/social-placeholder.png" alt="" width={35} height={35} />
                </a>
              </IconButton>
            </li>)}
          </ul>
        </ContentContainer>
      </footer>
    );
  }
  return (
    <footer data-appearance={variant} data-ui-tone="light" className={`footer-container ${variant === "standard" ? "ui-surface" : ""}`}>
      <div className="flex items-center space-x-2">
        <Image src={logo} alt="UTMIST Logo" width={32} height={32} />
        <span className="navbar-logo-text">UTMIST</span>
      </div>
      <ul className="footer-socials">
        {socials.map(({ name, href, icon }) => (
          <li key={name}>
            {variant === "standard" ? (
              <IconButton asChild tone="light" aria-label={`UTMIST on ${name}`}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Image src={icon} alt="" width={20} height={20} />
                </a>
              </IconButton>
            ) : (
              <div className="footer-logo-container">
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`UTMIST on ${name}`}>
                  <Image src={icon} alt="" />
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="bug-report-container">
        <a href="https://github.com/UTMIST/UTMIST/issues" target="_blank" rel="noopener noreferrer"
          className="bug-report-link" title="Report a bug">🐛 Report a bug</a>
      </div>
      <div className="footer-line" />
    </footer>
  );
}
