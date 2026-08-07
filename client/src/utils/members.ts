import type { SupabaseClient } from "@supabase/supabase-js";

import type { Member, MemberGroup } from "@/types/departments";

const MEMBERS_TABLE = "Members";
const DEPARTMENT_COLUMN = "Department";

export interface MemberRecord {
  Year?: number;
  "First Name"?: string;
  "Preferred/English"?: string;
  "Last Name"?: string;
  "UofT Email"?: string;
  Position?: string;
  Department?: string;
}

const MEMBER_SELECT =
  'Year, "First Name", "Preferred/English", "Last Name", "UofT Email", Position, Department';

export function getAvailableMemberYears(rows: MemberRecord[]): number[] {
  return [
    ...new Set(
      rows
        .map((row) => row.Year)
        .filter((year): year is number => typeof year === "number")
    ),
  ].sort((yearA, yearB) => yearB - yearA);
}

export function filterMemberRowsByYear(
  rows: MemberRecord[],
  year: number
): MemberRecord[] {
  return rows.filter((row) => row.Year === year);
}

export function formatMemberName(row: MemberRecord): string {
  const preferred = row["Preferred/English"]?.trim();
  const firstName = row["First Name"]?.trim();
  const lastName = row["Last Name"]?.trim();
  const firstPart = preferred || firstName || "";

  return [firstPart, lastName].filter(Boolean).join(" ").trim() || "Unknown";
}

export function filterMemberRowsForDepartments(
  rows: MemberRecord[],
  departments: string[]
): MemberRecord[] {
  const departmentSet = new Set(departments);

  return rows.filter(
    (row) =>
      row.Department?.trim() &&
      departmentSet.has(row.Department.trim())
  );
}

export function buildMemberGroups(rows: MemberRecord[]): MemberGroup[] {
  const seenEmails = new Set<string>();
  const membersByPosition = new Map<string, Member[]>();

  for (const row of rows) {
    const email = row["UofT Email"]?.trim() ?? "";
    if (email) {
      if (seenEmails.has(email)) {
        continue;
      }
      seenEmails.add(email);
    }

    const role = row.Position?.trim() || "Members";
    const member: Member = {
      name: formatMemberName(row),
      bio: "",
      email,
    };

    const group = membersByPosition.get(role) ?? [];
    group.push(member);
    membersByPosition.set(role, group);
  }

  return Array.from(membersByPosition.entries())
    .sort(([roleA], [roleB]) => roleA.localeCompare(roleB))
    .map(([role, members]) => ({ role, members }));
}

export interface MemberFace {
  name: string;
  email: string;
  position: string;
}

export function buildMemberFaces(rows: MemberRecord[]): MemberFace[] {
  const seen = new Set<string>();
  const faces: MemberFace[] = [];

  for (const row of rows) {
    const email = row["UofT Email"]?.trim() ?? "";
    const name = formatMemberName(row);
    const position = row.Position?.trim() || "Member";
    const key = email.toLowerCase() || `${name}-${position}`;

    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    faces.push({ name, email, position });
  }

  return faces;
}

export interface MemberProfile {
  avatar: string;
  linkedin: string;
  github: string;
}

/**
 * Look up members in the public.user table by their email address and return
 * their avatar and social links keyed by lower-cased email.
 */
export async function fetchMemberProfilesByEmail(
  emails: string[]
): Promise<Record<string, MemberProfile>> {
  const uniqueEmails = [
    ...new Set(emails.map((email) => email.trim()).filter(Boolean)),
  ];

  if (uniqueEmails.length === 0) {
    return {};
  }

  const { supabase } = await import("@/lib/supabase/client");

  try {
    const { data, error } = await supabase
      .from("user")
      .select("email, avatar, linkedin, github")
      .in("email", uniqueEmails);

    if (error) {
      console.error("Error fetching member profiles:", error);
      return {};
    }

    const profilesByEmail: Record<string, MemberProfile> = {};
    for (const row of data ?? []) {
      const email = String(row.email ?? "").trim().toLowerCase();
      if (!email) {
        continue;
      }

      profilesByEmail[email] = {
        avatar: row.avatar ?? "",
        linkedin: row.linkedin ?? "",
        github: row.github ?? "",
      };
    }

    return profilesByEmail;
  } catch (error) {
    console.error("Error in fetchMemberProfilesByEmail:", error);
    return {};
  }
}

export async function fetchMembersForDepartments(
  supabase: SupabaseClient,
  departments: string[]
): Promise<{ data: MemberRecord[]; error: string | null }> {
  if (departments.length === 0) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from(MEMBERS_TABLE)
      .select(MEMBER_SELECT)
      .in(DEPARTMENT_COLUMN, departments)
      .order("Position", { ascending: true });

    if (error) {
      console.error("Error fetching members for departments:", error);
      return { data: [], error: error.message };
    }

    return { data: (data ?? []) as MemberRecord[], error: null };
  } catch (error) {
    console.error("Error in fetchMembersForDepartments:", error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to load members",
    };
  }
}

export async function listMemberDepartments(): Promise<{
  data: string[];
  error: string | null;
}> {
  const { supabase } = await import("@/lib/supabase/client");

  try {
    const { data, error } = await supabase
      .from(MEMBERS_TABLE)
      .select(DEPARTMENT_COLUMN)
      .order(DEPARTMENT_COLUMN, { ascending: true });

    if (error) {
      console.error("Error listing member departments:", error);
      return { data: [], error: error.message };
    }

    const departments = [
      ...new Set(
        (data ?? [])
          .map((row) => String(row[DEPARTMENT_COLUMN] ?? "").trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));

    return { data: departments, error: null };
  } catch (error) {
    console.error("Error in listMemberDepartments:", error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to load member departments",
    };
  }
}
