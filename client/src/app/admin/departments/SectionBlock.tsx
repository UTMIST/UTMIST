"use client";

import {
  Field as FormischField,
  getInput,
  setInput,
  type FormStore,
} from "@formisch/react";
import { XIcon } from "lucide-react";

import type { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";
import {
  createEmptySectionDataJson,
  parseSectionDataJson,
  stringifySectionData,
} from "@/app/admin/departments/sectionData";
import {
  DEPARTMENT_COMPONENT_REGISTRY,
  getDepartmentComponent,
  type ComponentFieldDef,
} from "@/app/admin/departments/componentRegistry";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SectionBlockProps {
  form: FormStore<typeof DepartmentFormSchema>;
  index: number;
  disabled?: boolean;
  onRemove: () => void;
  canRemove: boolean;
}

function updateSectionDataField(
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

function DataField({
  fieldDef,
  index,
  form,
  disabled,
}: {
  fieldDef: ComponentFieldDef;
  index: number;
  form: FormStore<typeof DepartmentFormSchema>;
  disabled?: boolean;
}) {
  const fieldId = `admin-section-${index}-${fieldDef.key}`;
  const dataJson =
    getInput(form, { path: ["sections", index, "dataJson"] }) ?? "{}";
  const value = parseSectionDataJson(dataJson)[fieldDef.key] ?? "";

  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{fieldDef.label}</FieldLabel>
      {fieldDef.type === "textarea" || fieldDef.type === "json" ? (
        <Textarea
          id={fieldId}
          value={value}
          onChange={(event) =>
            updateSectionDataField(form, index, fieldDef.key, event.target.value)
          }
          placeholder={fieldDef.placeholder}
          className={
            fieldDef.type === "json"
              ? "min-h-[140px] font-mono text-xs"
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

export default function SectionBlock({
  form,
  index,
  disabled,
  onRemove,
  canRemove,
}: SectionBlockProps) {
  return (
    <FieldSet className="rounded-xl border p-4 gap-4">
      <div className="flex items-start justify-between gap-3">
        <FieldLegend variant="label">Section {index + 1}</FieldLegend>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove section ${index + 1}`}
          >
            <XIcon className="size-4" />
            Remove
          </Button>
        )}
      </div>

      <FormischField of={form} path={["sections", index, "component"]}>
        {(field) => {
          const selectedComponent = getDepartmentComponent(field.input ?? "");

          return (
            <>
              <Field data-invalid={field.errors !== null}>
                <FieldLabel htmlFor={`admin-section-${index}-component`}>
                  Component Type
                </FieldLabel>
                <Select
                  value={field.input ?? ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setInput(form, {
                      path: ["sections", index, "dataJson"],
                      input: createEmptySectionDataJson(value),
                    });
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger id={`admin-section-${index}-component`}>
                    <SelectValue placeholder="Choose a component" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENT_COMPONENT_REGISTRY.map((component) => (
                      <SelectItem key={component.id} value={component.id}>
                        {component.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  {selectedComponent?.description ??
                    "Pick which block of content to show on the department page."}
                </FieldDescription>
                {field.errors && (
                  <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                  />
                )}
              </Field>

              {selectedComponent && (
                <div className="space-y-4 border-t pt-4">
                  {selectedComponent.fields.map((fieldDef) => (
                    <DataField
                      key={fieldDef.key}
                      fieldDef={fieldDef}
                      index={index}
                      form={form}
                      disabled={disabled}
                    />
                  ))}
                </div>
              )}
            </>
          );
        }}
      </FormischField>
    </FieldSet>
  );
}
