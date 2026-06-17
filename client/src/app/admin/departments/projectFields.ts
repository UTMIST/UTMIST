import type { ComponentFieldDef } from "@/app/admin/departments/componentRegistry";

export interface GalleryProject {
  title: string;
  description: string;
  github: string;
  readMoreLink: string;
  image: string;
}

export const GALLERY_PROJECT_ITEM_FIELDS: ComponentFieldDef[] = [
  { key: "title", label: "Title", type: "text", placeholder: "Project name" },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Short project description",
  },
  {
    key: "github",
    label: "GitHub URL",
    type: "url",
    placeholder: "https://github.com/...",
  },
  {
    key: "readMoreLink",
    label: "Read More Link",
    type: "url",
    placeholder: "https://...",
  },
  {
    key: "image",
    label: "Image URL",
    type: "text",
    placeholder: "Optional. Leave blank to use /project_images/{title}.png",
  },
];

export function createEmptyGalleryProject(): GalleryProject {
  return {
    title: "",
    description: "",
    github: "",
    readMoreLink: "",
    image: "",
  };
}

export function parseGalleryProjects(value: string): GalleryProject[] {
  if (!value.trim()) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item && typeof item === "object")
      )
      .map((item) => ({
        title: String(item.title ?? ""),
        description: String(item.description ?? ""),
        github: String(item.github ?? ""),
        readMoreLink: String(item.readMoreLink ?? ""),
        image: String(item.image ?? ""),
      }));
  } catch {
    return [];
  }
}

export function stringifyGalleryProjects(projects: GalleryProject[]): string {
  return JSON.stringify(projects);
}
