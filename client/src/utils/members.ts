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
  '"First Name", "Preferred/English", "Last Name", "UofT Email", Position, Department';

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
