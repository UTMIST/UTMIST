import { supabase } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
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

function pickLatestVersionPerSlug(pages: DepartmentPage[]): DepartmentPage[] {
  const latestBySlug = new Map<string, DepartmentPage>();

  for (const page of pages) {
    const existing = latestBySlug.get(page.slug);
    if (!existing) {
      latestBySlug.set(page.slug, page);
      continue;
    }

    const pageTime = page.created_at ?? page.updated_at ?? "";
    const existingTime = existing.created_at ?? existing.updated_at ?? "";
    if (pageTime > existingTime) {
      latestBySlug.set(page.slug, page);
    }
  }

  return Array.from(latestBySlug.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export async function listDepartmentPagesFromDb(
  supabase: SupabaseClient
): Promise<{
  data: DepartmentPage[];
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error listing department pages:", error);
      return { data: [], error: error.message };
    }

    return {
      data: pickLatestVersionPerSlug(
        (data ?? []).map((row) =>
          normalizeDepartmentPage(row as Record<string, unknown>)
        )
      ),
      error: null,
    };
  } catch (error) {
    console.error("Error in listDepartmentPagesFromDb:", error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to load department pages",
    };
  }
}

export async function listDepartmentPages(): Promise<{
  data: DepartmentPage[];
  error: string | null;
}> {
  return listDepartmentPagesFromDb(supabase);
}

export async function getDepartmentPageBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<{ data: DepartmentPage | null; error: string | null }> {
  try {
    const normalizedSlug = slugifyDepartmentName(slug);
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("slug", normalizedSlug)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching department page:", error);
      return { data: null, error: error.message };
    }

    if (!data) {
      return { data: null, error: null };
    }

    return {
      data: normalizeDepartmentPage(data as Record<string, unknown>),
      error: null,
    };
  } catch (error) {
    console.error("Error in getDepartmentPageBySlug:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load department page",
    };
  }
}

async function insertDepartmentPage(
  input: DepartmentPageInput
): Promise<{ data: DepartmentPage | null; error: string | null }> {
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
    return { data: null, error: error.message };
  }

  return {
    data: normalizeDepartmentPage(data as Record<string, unknown>),
    error: null,
  };
}

export async function createDepartmentPage(
  input: DepartmentPageInput
): Promise<{ data: DepartmentPage | null; error: string | null }> {
  try {
    const result = await insertDepartmentPage(input);

    if (result.error) {
      console.error("Error creating department page:", result.error);
    }

    return result;
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
  _id: string,
  input: DepartmentPageInput
): Promise<{ data: DepartmentPage | null; error: string | null }> {
  try {
    const result = await insertDepartmentPage(input);

    if (result.error) {
      console.error("Error saving department page version:", result.error);
    }

    return result;
  } catch (error) {
    console.error("Error in updateDepartmentPage:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save department page version",
    };
  }
}
