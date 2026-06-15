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
  getSectionDataFieldValue,
  updateSectionDataField,
} from "./sectionDataField";

interface DefaultSectionDataFieldProps {
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
}: DefaultSectionDataFieldProps) {
  const fieldId = `admin-section-${index}-${fieldDef.key}`;
  const value = getSectionDataFieldValue(form, index, fieldDef.key);

  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{fieldDef.label}</FieldLabel>
      {fieldDef.type === "textarea" ||
      fieldDef.type === "json" ||
      fieldDef.type === "markdown" ? (
        <Textarea
          id={fieldId}
          value={value}
          onChange={(event) =>
            updateSectionDataField(form, index, fieldDef.key, event.target.value)
          }
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
          onChange={(event) =>
            updateSectionDataField(form, index, fieldDef.key, event.target.value)
          }
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
