import { supabase } from "@/lib/supabase/client";
import type {
  DepartmentPage,
  DepartmentPageInput,
  DepartmentPageSection,
} from "@/types/departments";

const TABLE = "department_page";

export function slugifyDepartmentName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeSections(
  sections: DepartmentPageSection[] | null | undefined
): DepartmentPageSection[] {
  if (!Array.isArray(sections)) {
    return [];
  }

  return sections.map((section) => ({
    component: section.component ?? "",
    data: Object.fromEntries(
      Object.entries(section.data ?? {}).map(([key, value]) => [
        key,
        String(value),
      ])
    ),
  }));
}

function normalizeDepartmentPage(row: Record<string, unknown>): DepartmentPage {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    tagline: String(row.tagline ?? ""),
    sections: normalizeSections(
      row.sections as DepartmentPageSection[] | undefined
    ),
    slug: String(row.slug ?? ""),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export async function listDepartmentPages(): Promise<{
  data: DepartmentPage[];
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error listing department pages:", error);
      return { data: [], error: error.message };
    }

    return {
      data: (data ?? []).map((row) =>
        normalizeDepartmentPage(row as Record<string, unknown>)
      ),
      error: null,
    };
  } catch (error) {
    console.error("Error in listDepartmentPages:", error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to load department pages",
    };
  }
}

export async function createDepartmentPage(
  input: DepartmentPageInput
): Promise<{ data: DepartmentPage | null; error: string | null }> {
  try {
    const now = new Date().toISOString();
    const slug = slugifyDepartmentName(input.slug);

    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: input.name,
        tagline: input.tagline,
        sections: input.sections,
        slug,
        created_at: now,
        updated_at: now,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating department page:", error);
      return { data: null, error: error.message };
    }

    return {
      data: normalizeDepartmentPage(data as Record<string, unknown>),
      error: null,
    };
  } catch (error) {
    console.error("Error in createDepartmentPage:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create department page",
    };
  }
}

export async function updateDepartmentPage(
  id: string,
  input: DepartmentPageInput
): Promise<{ data: DepartmentPage | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .update({
        name: input.name,
        tagline: input.tagline,
        sections: input.sections,
        slug: slugifyDepartmentName(input.slug),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating department page:", error);
      return { data: null, error: error.message };
    }

    return {
      data: normalizeDepartmentPage(data as Record<string, unknown>),
      error: null,
    };
  } catch (error) {
    console.error("Error in updateDepartmentPage:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update department page",
    };
  }
}
