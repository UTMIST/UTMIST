import { createEmptySectionData } from "@/app/admin/departments/componentRegistry";
import type {
  DepartmentPageFormInput,
  DepartmentPageFormSection,
  DepartmentPageInput,
  DepartmentPageSection,
} from "@/types/departments";

export function parseSectionDataJson(
  dataJson: string
): Record<string, string> {
  if (!dataJson.trim()) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(dataJson);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key, String(value)])
    );
  } catch {
    return {};
  }
}

export function stringifySectionData(
  data: Record<string, string>
): string {
  return JSON.stringify(data);
}

export function parseSelectedDepartments(value: string): string[] {
  if (!value.trim()) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );
  } catch {
    return [];
  }
}

export function stringifySelectedDepartments(departments: string[]): string {
  return JSON.stringify(departments);
}

export function createEmptySectionDataJson(componentId: string): string {
  return stringifySectionData(createEmptySectionData(componentId));
}

export function formSectionToSection(
  section: DepartmentPageFormSection
): DepartmentPageSection {
  return {
    component: section.component,
    data: parseSectionDataJson(section.dataJson),
  };
}

export function sectionToFormSection(
  section: DepartmentPageSection
): DepartmentPageFormSection {
  return {
    component: section.component,
    dataJson: stringifySectionData(section.data ?? {}),
  };
}

export function toDepartmentPageFormInput(
  page: Pick<DepartmentPageInput, "name" | "tagline" | "slug" | "sections">
): DepartmentPageFormInput {
  return {
    name: page.name,
    tagline: page.tagline,
    slug: page.slug,
    sections: page.sections.map(sectionToFormSection),
  };
}

export function toDepartmentPageInput(
  formInput: DepartmentPageFormInput
): DepartmentPageInput {
  return {
    name: formInput.name,
    tagline: formInput.tagline,
    slug: formInput.slug,
    sections: formInput.sections.map(formSectionToSection),
  };
}
