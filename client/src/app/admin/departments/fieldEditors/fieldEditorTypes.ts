import type { FormStore } from "@formisch/react";

import type { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";

import {
  getSectionDataFieldValue,
  updateSectionDataField,
} from "./sectionDataField";

export interface SectionFieldAccessor {
  getValue?: (fieldKey: string) => string;
  setValue?: (fieldKey: string, value: string) => void;
}

export function resolveSectionFieldAccessor(
  form: FormStore<typeof DepartmentFormSchema>,
  index: number,
  accessor?: SectionFieldAccessor
) {
  const readValue =
    accessor?.getValue ??
    ((fieldKey: string) => getSectionDataFieldValue(form, index, fieldKey));

  const writeValue =
    accessor?.setValue ??
    ((fieldKey: string, value: string) =>
      updateSectionDataField(form, index, fieldKey, value));

  return { readValue, writeValue };
}
