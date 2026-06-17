"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import Mail from "../../public/email.svg";
import type { Member, MemberGroup } from "@/types/departments";
import { cn } from "@/lib/utils";
import {
  buildMemberGroups,
  getAvailableMemberYears,
  filterMemberRowsByYear,
  type MemberRecord,
} from "@/utils/members";

const SUBTITLE_INLINE_MAX_LENGTH = 45;

export function MemberList({
  memberRows,
  title = "Member List",
  subtitle = "See who makes us special!",
  searchPlaceholder = "Search members",
}: {
  memberRows: MemberRecord[];
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const sectionSubtitle = subtitle?.trim() ?? "";
  const subtitleOnSeparateRow =
    sectionSubtitle.length > SUBTITLE_INLINE_MAX_LENGTH;
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

  const members = useMemo(() => {
    if (selectedYear === "") {
      return [];
    }

    return buildMemberGroups(
      filterMemberRowsByYear(memberRows, selectedYear)
    );
  }, [memberRows, selectedYear]);

  const groupComponents = members
    .map((group: MemberGroup) => {
      const filteredMembers = group.members.filter(
        (member: Member) =>
          member.name.toLowerCase().includes(query.toLowerCase()) ||
          member.bio.toLowerCase().includes(query.toLowerCase()) ||
          member.email.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredMembers.length === 0) {
        return null;
      }

      const memberComponents = filteredMembers.map((member, memberIndex) => (
        <li className="my-[5px]" key={`${member.email || member.name}-${memberIndex}`}>
          <PersonCard name={member.name} bio={member.bio} email={member.email} />
        </li>
      ));

      return (
        <div key={group.role}>
          <p className="mb-2 ml-6 text-3xl font-normal">{group.role}</p>
          <ul>{memberComponents}</ul>
        </div>
      );
    })
    .filter(Boolean);

  return (
    <div className="w-fit max-w-full self-center">
      <div>
        <h1 className="text-right text-3xl">{title}</h1>
        <div
          className={cn(
            "flex items-center gap-3",
            subtitleOnSeparateRow ? "flex-wrap" : "flex-nowrap justify-between"
          )}
        >
          <input
            className="shrink-0 rounded-4xl border-2 p-3"
            type="search"
            value={query}
            placeholder={searchPlaceholder}
            onChange={(event) => setQuery(event.target.value)}
          />
          {sectionSubtitle && (
            <span
              className={cn(
                "text-right text-xl",
                subtitleOnSeparateRow ? "w-full" : "shrink-0"
              )}
            >
              {sectionSubtitle}
            </span>
          )}
        </div>
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
      <div>
        <div className="mt-4 h-[40rem] w-fit max-w-full overflow-x-hidden overflow-y-auto rounded-2xl border-2 pt-1">
          {groupComponents.length > 0 ? (
            groupComponents
          ) : (
            <p className="px-6 py-8 text-center text-gray-500">
              {availableYears.length === 0
                ? "No members found for the selected departments."
                : "No members match your search for this year."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function PersonCard({ name, bio, email }: Member) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="my-[5px] mx-[8px] flex h-fit w-[494px] max-w-full justify-between rounded-[15px] bg-[#e8e8e8] px-[25px] py-[10px] font-sans">
      <p className="h-fit shrink-0 truncate text-[25px]">{name}</p>
      <button
        className="h-fit w-fit"
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p
          className="max-w-[211px] cursor-pointer overflow-hidden text-ellipsis px-[7px] py-[8px] text-left text-[17px] font-light"
          style={{
            transition: "max-height 0.4s ease",
            maxHeight: isExpanded ? "150px" : "40px",
          }}
        >
          {bio}
        </p>
      </button>

      <EmailTooltip email={email} />
    </div>
  );
}

function EmailTooltip({ email }: { email: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    const button = buttonRef.current;
    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    setPosition({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
  };

  const showTooltip = () => {
    if (!email.trim()) {
      return;
    }

    updatePosition();
    setVisible(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        className="relative mt-[9px] h-fit"
        type="button"
        onMouseEnter={showTooltip}
        onMouseLeave={() => setVisible(false)}
        onFocus={showTooltip}
        onBlur={() => setVisible(false)}
      >
        <Image
          src={Mail}
          alt="Mail icon"
          width={30}
          className="relative h-fit cursor-pointer"
        />
      </button>
      {visible && email && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-[9px] bg-[#a1a1a1] px-[8px] py-[3px] text-center text-sm whitespace-nowrap select-text"
          style={{ top: position.top, left: position.left }}
        >
          {email}
          <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-[6px] border-solid border-t-[#a1a1a1] border-r-transparent border-b-transparent border-l-transparent" />
        </div>
      )}
    </>
  );
}
