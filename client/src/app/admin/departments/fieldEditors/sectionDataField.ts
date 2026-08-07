import { getInput, setInput, type FormStore } from "@formisch/react";

import type { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";
import {
  parseSectionDataJson,
  stringifySectionData,
} from "@/app/admin/departments/sectionData";

export function getSectionDataFieldValue(
  form: FormStore<typeof DepartmentFormSchema>,
  index: number,
  key: string
): string {
  const dataJson = getInput(form, { path: ["sections", index, "dataJson"] }) ?? "{}";
  return parseSectionDataJson(dataJson)[key] ?? "";
}

export function updateSectionDataField(
  form: FormStore<typeof DepartmentFormSchema>,
  index: number,
  key: string,
  value: string
) {
  const dataJson =
    getInput(form, { path: ["sections", index, "dataJson"] }) ?? "{}";
  const data = parseSectionDataJson(dataJson);
  data[key] = value;

  setInput(form, {
    path: ["sections", index, "dataJson"],
    input: stringifySectionData(data),
  });
}
