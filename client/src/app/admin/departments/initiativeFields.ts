import type { ComponentFieldDef } from "@/app/admin/departments/componentRegistry";
import type { Initiative } from "@/types/departments";

export const INITIATIVE_ITEM_FIELDS: ComponentFieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  {
    key: "projectLink",
    label: "Project Link",
    type: "url",
    placeholder: "https://...",
  },
  {
    key: "image",
    label: "Image URL",
    type: "text",
    placeholder: "file.svg or https://...",
  },
];

export function createEmptyInitiative(): Initiative {
  return {
    title: "",
    description: "",
    projectLink: "",
    image: "",
  };
}

export function parseInitiatives(value: string): Initiative[] {
  if (!value.trim()) {
    return [createEmptyInitiative()];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [createEmptyInitiative()];
    }

    const initiatives = parsed
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
      .map((item) => ({
        title: String(item.title ?? ""),
        description: String(item.description ?? ""),
        projectLink: String(item.projectLink ?? ""),
        image: String(item.image ?? ""),
      }));

    return initiatives.length > 0 ? initiatives : [createEmptyInitiative()];
  } catch {
    return [createEmptyInitiative()];
  }
}

export function stringifyInitiatives(initiatives: Initiative[]): string {
  return JSON.stringify(initiatives);
}
