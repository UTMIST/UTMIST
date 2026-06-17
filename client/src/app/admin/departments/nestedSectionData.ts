import {
  DEPARTMENT_COMPONENT_REGISTRY,
  createEmptySectionData,
  getDepartmentComponent,
  TWO_COLUMN_ROW_ID,
} from "@/app/admin/departments/componentRegistry";
import {
  parseSectionDataJson,
  parseSelectedDepartments,
  stringifySectionData,
} from "@/app/admin/departments/sectionData";
import type { DepartmentPageSection } from "@/types/departments";

export type ColumnSide = "left" | "right";

export const NESTABLE_COMPONENTS = DEPARTMENT_COMPONENT_REGISTRY.filter(
  (component) => component.id !== TWO_COLUMN_ROW_ID
);

export function getColumnComponent(
  data: Record<string, string>,
  column: ColumnSide
): string {
  return data[`${column}Component`] ?? "";
}

export function getColumnDataJson(
  data: Record<string, string>,
  column: ColumnSide
): string {
  return data[`${column}DataJson`] ?? "{}";
}

export function getColumnData(
  data: Record<string, string>,
  column: ColumnSide
): Record<string, string> {
  return parseSectionDataJson(getColumnDataJson(data, column));
}

export function createEmptyColumnDataJson(componentId: string): string {
  if (!componentId) {
    return stringifySectionData({});
  }

  return stringifySectionData(createEmptySectionData(componentId));
}

export function parseNestedSection(
  componentId: string,
  dataJson: string
): DepartmentPageSection {
  return {
    component: componentId,
    data: parseSectionDataJson(dataJson),
  };
}

const MEMBER_COMPONENT_IDS = new Set(["member_list", "member_faces"]);

export type MemberListSlot = {
  key: string;
  departments: string[];
};

export function collectMemberListSlots(
  sections: DepartmentPageSection[]
): MemberListSlot[] {
  const slots: MemberListSlot[] = [];

  sections.forEach((section, index) => {
    if (MEMBER_COMPONENT_IDS.has(section.component)) {
      slots.push({
        key: String(index),
        departments: parseSelectedDepartments(section.data.departments ?? ""),
      });
      return;
    }

    if (section.component !== TWO_COLUMN_ROW_ID) {
      return;
    }

    for (const column of ["left", "right"] as const) {
      const nestedComponent = getColumnComponent(section.data, column);
      if (!MEMBER_COMPONENT_IDS.has(nestedComponent)) {
        continue;
      }

      slots.push({
        key: `${index}-${column}`,
        departments: parseSelectedDepartments(
          getColumnData(section.data, column).departments ?? ""
        ),
      });
    }
  });

  return slots;
}

export function validateNestedSectionData(
  sectionIndex: number,
  column: ColumnSide,
  componentId: string,
  data: Record<string, string>
): string | null {
  const component = getDepartmentComponent(componentId);
  if (!component) {
    return null;
  }

  for (const fieldDef of component.fields) {
    if (fieldDef.type !== "json") {
      continue;
    }

    const rawValue = data[fieldDef.key]?.trim();
    if (!rawValue) {
      return `Section ${sectionIndex + 1} (${column} column): ${fieldDef.label} is required.`;
    }

    try {
      JSON.parse(rawValue);
    } catch {
      return `Section ${sectionIndex + 1} (${column} column): ${fieldDef.label} must be valid JSON.`;
    }
  }

  return null;
}
