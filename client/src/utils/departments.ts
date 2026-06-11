import { supabase } from "@/lib/supabase/client";
import type { DepartmentPage, DepartmentPageInput } from "@/types/departments";

const TABLE = "department_page";

export function slugifyDepartmentName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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

    return { data: (data ?? []) as DepartmentPage[], error: null };
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
    const slug = slugifyDepartmentName(input.name);

    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: input.name,
        tagline: input.tagline,
        description: input.description,
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

    return { data: data as DepartmentPage, error: null };
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
        description: input.description,
        slug: slugifyDepartmentName(input.name),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating department page:", error);
      return { data: null, error: error.message };
    }

    return { data: data as DepartmentPage, error: null };
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
