import { supabase } from "@/lib/supabase/client";

const MEMBERS_TABLE = "Members";
const DEPARTMENT_COLUMN = "Department";

export async function listMemberDepartments(): Promise<{
  data: string[];
  error: string | null;
}> {
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
