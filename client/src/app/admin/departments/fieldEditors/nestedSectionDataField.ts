import { getInput, setInput, type FormStore } from "@formisch/react";

import type { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";
import type { ColumnSide } from "@/app/admin/departments/nestedSectionData";
import {
  getColumnDataJson,
  getColumnComponent,
} from "@/app/admin/departments/nestedSectionData";
import {
  parseSectionDataJson,
  stringifySectionData,
} from "@/app/admin/departments/sectionData";

import {
  getSectionDataFieldValue,
  updateSectionDataField,
} from "./sectionDataField";

export function getColumnDataFieldValue(
  form: FormStore<typeof DepartmentFormSchema>,
  sectionIndex: number,
  column: ColumnSide,
  fieldKey: string
): string {
  const sectionDataJson =
    getInput(form, { path: ["sections", sectionIndex, "dataJson"] }) ?? "{}";
  const sectionData = parseSectionDataJson(sectionDataJson);
  const columnData = parseSectionDataJson(getColumnDataJson(sectionData, column));
  return columnData[fieldKey] ?? "";
}

export function updateColumnDataField(
  form: FormStore<typeof DepartmentFormSchema>,
  sectionIndex: number,
  column: ColumnSide,
  fieldKey: string,
  value: string
) {
  const sectionDataJson =
    getInput(form, { path: ["sections", sectionIndex, "dataJson"] }) ?? "{}";
  const sectionData = parseSectionDataJson(sectionDataJson);
  const columnData = parseSectionDataJson(getColumnDataJson(sectionData, column));
  columnData[fieldKey] = value;

  updateSectionDataField(
    form,
    sectionIndex,
    `${column}DataJson`,
    stringifySectionData(columnData)
  );
}

export function getColumnComponentValue(
  form: FormStore<typeof DepartmentFormSchema>,
  sectionIndex: number,
  column: ColumnSide
): string {
  const sectionDataJson =
    getInput(form, { path: ["sections", sectionIndex, "dataJson"] }) ?? "{}";
  return getColumnComponent(parseSectionDataJson(sectionDataJson), column);
}

export function setColumnComponentValue(
  form: FormStore<typeof DepartmentFormSchema>,
  sectionIndex: number,
  column: ColumnSide,
  componentId: string,
  emptyDataJson: string
) {
  updateSectionDataField(form, sectionIndex, `${column}Component`, componentId);
  updateSectionDataField(form, sectionIndex, `${column}DataJson`, emptyDataJson);
}

export function getSectionDataFromForm(
  form: FormStore<typeof DepartmentFormSchema>,
  sectionIndex: number
): Record<string, string> {
  const dataJson =
    getInput(form, { path: ["sections", sectionIndex, "dataJson"] }) ?? "{}";
  return parseSectionDataJson(dataJson);
}

export function setSectionDataOnForm(
  form: FormStore<typeof DepartmentFormSchema>,
  sectionIndex: number,
  data: Record<string, string>
) {
  setInput(form, {
    path: ["sections", sectionIndex, "dataJson"],
    input: stringifySectionData(data),
  });
}
