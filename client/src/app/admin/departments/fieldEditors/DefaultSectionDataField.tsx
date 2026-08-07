"use client";

import type { FormStore } from "@formisch/react";

import type { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";
import type { ComponentFieldDef } from "@/app/admin/departments/componentRegistry";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  type SectionFieldAccessor,
  resolveSectionFieldAccessor,
} from "./fieldEditorTypes";

interface DefaultSectionDataFieldProps extends SectionFieldAccessor {
  fieldDef: ComponentFieldDef;
  index: number;
  form: FormStore<typeof DepartmentFormSchema>;
  disabled?: boolean;
}

export default function DefaultSectionDataField({
  fieldDef,
  index,
  form,
  disabled,
  getValue,
  setValue,
}: DefaultSectionDataFieldProps) {
  const { readValue, writeValue } = resolveSectionFieldAccessor(form, index, {
    getValue,
    setValue,
  });
  const fieldId = `admin-section-${index}-${fieldDef.key}`;
  const value = readValue(fieldDef.key);

  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{fieldDef.label}</FieldLabel>
      {fieldDef.type === "textarea" ||
      fieldDef.type === "json" ||
      fieldDef.type === "markdown" ? (
        <Textarea
          id={fieldId}
          value={value}
          onChange={(event) => writeValue(fieldDef.key, event.target.value)}
          placeholder={fieldDef.placeholder}
          className={
            fieldDef.type === "json" || fieldDef.type === "markdown"
              ? "min-h-[180px] font-mono text-sm"
              : "min-h-[100px]"
          }
          disabled={disabled}
        />
      ) : (
        <Input
          id={fieldId}
          value={value}
          onChange={(event) => writeValue(fieldDef.key, event.target.value)}
          placeholder={fieldDef.placeholder}
          type={fieldDef.type === "url" ? "url" : "text"}
          autoComplete="off"
          disabled={disabled}
        />
      )}
      {fieldDef.description && (
        <FieldDescription>{fieldDef.description}</FieldDescription>
      )}
    </Field>
  );
}
