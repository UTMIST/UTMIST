"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Logo from "../../public/logo-whitebottom.svg";
import { cn } from "@/lib/utils";
import {
  buildMemberFaces,
  fetchMemberProfilesByEmail,
  filterMemberRowsByYear,
  getAvailableMemberYears,
  type MemberFace,
  type MemberProfile,
  type MemberRecord,
} from "@/utils/members";

const FALLBACK_BACKGROUND = "#00349f";

export function MemberFaces({
  memberRows,
  title,
  subtitle,
  searchPlaceholder = "Search members",
}: {
  memberRows: MemberRecord[];
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [profilesByEmail, setProfilesByEmail] = useState<
    Record<string, MemberProfile>
  >({});

  const sectionTitle = title?.trim() ?? "";
  const sectionSubtitle = subtitle?.trim() ?? "";

  const availableYears = useMemo(
    () => getAvailableMemberYears(memberRows),
    [memberRows]
  );
  const [selectedYear, setSelectedYear] = useState<number | "">("");

  useEffect(() => {
    if (availableYears.length === 0) {
      setSelectedYear("");
      return;
    }

    setSelectedYear((currentYear) =>
      currentYear !== "" && availableYears.includes(currentYear)
        ? currentYear
        : availableYears[0]
    );
  }, [availableYears]);

  const faces = useMemo(() => {
    if (selectedYear === "") {
      return [];
    }

    return buildMemberFaces(filterMemberRowsByYear(memberRows, selectedYear));
  }, [memberRows, selectedYear]);

  useEffect(() => {
    const emails = faces.map((face) => face.email).filter(Boolean);
    if (emails.length === 0) {
      return;
    }

    let isActive = true;
    fetchMemberProfilesByEmail(emails).then((profiles) => {
      if (isActive) {
        setProfilesByEmail(profiles);
      }
    });

    return () => {
      isActive = false;
    };
  }, [faces]);

  const filteredFaces = faces.filter(
    (face) =>
      face.name.toLowerCase().includes(query.toLowerCase()) ||
      face.position.toLowerCase().includes(query.toLowerCase()) ||
      face.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full self-center text-left">
      <div>
        {sectionTitle && (
          <div className="mb-4">
            <h1 className="text-3xl font-normal text-gray-900">{sectionTitle}</h1>
            <div
              className="mt-2 h-1 w-16 bg-[#00349f]"
              aria-hidden="true"
            />
          </div>
        )}
        {sectionSubtitle && (
          <p className="mb-4 text-xl text-gray-700">{sectionSubtitle}</p>
        )}
        <input
          className="rounded-4xl border-2 p-3"
          type="search"
          value={query}
          placeholder={searchPlaceholder}
          onChange={(event) => setQuery(event.target.value)}
        />
        {availableYears.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {availableYears.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  selectedYear === year
                    ? "border-[#1E19B1] bg-[#1E19B1] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-[#1E19B1] hover:text-[#1E19B1]"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        {filteredFaces.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-10">
            {filteredFaces.map((face, index) => (
              <li key={`${face.email || face.name}-${index}`}>
                <FaceCard
                  face={face}
                  profile={
                    face.email
                      ? profilesByEmail[face.email.toLowerCase()]
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-8 text-center text-gray-500">
            {availableYears.length === 0
              ? "No members found for the selected departments."
              : "No members match your search for this year."}
          </p>
        )}
      </div>
    </div>
  );
}

function FaceCard({
  face,
  profile,
}: {
  face: MemberFace;
  profile?: MemberProfile;
}) {
  const avatar = profile?.avatar?.trim();

  return (
    <div className="flex w-40 flex-col items-center text-center">
      <div className="mb-2 flex h-7 items-center justify-center gap-3">
        {profile?.linkedin?.trim() && (
          <SocialLink href={profile.linkedin} label="LinkedIn">
            <LinkedInIcon />
          </SocialLink>
        )}
        {profile?.github?.trim() && (
          <SocialLink href={profile.github} label="GitHub">
            <GitHubIcon />
          </SocialLink>
        )}
      </div>

      <div className="relative h-32 w-32 overflow-hidden rounded-full border border-[#00349f]">
        {avatar ? (
          <Image
            src={avatar}
            alt={face.name}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: FALLBACK_BACKGROUND }}
          >
            <Image
              src={Logo}
              alt="UTMIST logo"
              className="h-3/5 w-3/5 object-contain"
            />
          </div>
        )}
      </div>

      <p className="mt-4 text-lg leading-tight">{face.name}</p>
      <p className="mt-1 text-sm font-medium text-[#00349f]">{face.position}</p>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-gray-700 transition-colors hover:text-[#00349f]"
    >
      {children}
    </Link>
  );
}

function LinkedInIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
