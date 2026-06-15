"use client";

import { XIcon } from "lucide-react";
import type { FormStore } from "@formisch/react";

import type { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";
import type { ComponentFieldDef } from "@/app/admin/departments/componentRegistry";
import {
  createEmptyInitiative,
  INITIATIVE_ITEM_FIELDS,
  parseInitiatives,
  stringifyInitiatives,
} from "@/app/admin/departments/initiativeFields";
import type { Initiative } from "@/types/departments";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  getSectionDataFieldValue,
  updateSectionDataField,
} from "./sectionDataField";

interface InitiativeRepeaterFieldProps {
  fieldDef: ComponentFieldDef;
  index: number;
  form: FormStore<typeof DepartmentFormSchema>;
  disabled?: boolean;
}

function InitiativeItemFields({
  initiativeIndex,
  initiative,
  sectionIndex,
  fieldKey,
  form,
  disabled,
  onRemove,
  canRemove,
}: {
  initiativeIndex: number;
  initiative: Initiative;
  sectionIndex: number;
  fieldKey: string;
  form: FormStore<typeof DepartmentFormSchema>;
  disabled?: boolean;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const updateField = (key: keyof Initiative, value: string) => {
    const storedValue = getSectionDataFieldValue(form, sectionIndex, fieldKey);
    const initiatives = parseInitiatives(storedValue);
    const next = [...initiatives];
    next[initiativeIndex] = { ...next[initiativeIndex], [key]: value };

    updateSectionDataField(
      form,
      sectionIndex,
      fieldKey,
      stringifyInitiatives(next)
    );
  };

  return (
    <FieldSet className="rounded-lg border p-4 gap-4">
      <div className="flex items-start justify-between gap-3">
        <FieldLegend variant="label">
          Initiative {initiativeIndex + 1}
        </FieldLegend>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove initiative ${initiativeIndex + 1}`}
          >
            <XIcon className="size-4" />
            Remove
          </Button>
        )}
      </div>

      {INITIATIVE_ITEM_FIELDS.map((itemField) => {
        const fieldId = `admin-section-${sectionIndex}-initiative-${initiativeIndex}-${itemField.key}`;
        const value = initiative[itemField.key as keyof Initiative] ?? "";

        return (
          <Field key={itemField.key}>
            <FieldLabel htmlFor={fieldId}>{itemField.label}</FieldLabel>
            {itemField.type === "textarea" ? (
              <Textarea
                id={fieldId}
                value={value}
                onChange={(event) =>
                  updateField(itemField.key as keyof Initiative, event.target.value)
                }
                placeholder={itemField.placeholder}
                className="min-h-[100px]"
                disabled={disabled}
              />
            ) : (
              <Input
                id={fieldId}
                value={value}
                onChange={(event) =>
                  updateField(itemField.key as keyof Initiative, event.target.value)
                }
                placeholder={itemField.placeholder}
                type={itemField.type === "url" ? "url" : "text"}
                autoComplete="off"
                disabled={disabled}
              />
            )}
          </Field>
        );
      })}
    </FieldSet>
  );
}

export default function InitiativeRepeaterField({
  fieldDef,
  index,
  form,
  disabled,
}: InitiativeRepeaterFieldProps) {
  const storedValue = getSectionDataFieldValue(form, index, fieldDef.key);
  const initiatives = parseInitiatives(storedValue);

  const setInitiatives = (nextInitiatives: Initiative[]) => {
    updateSectionDataField(
      form,
      index,
      fieldDef.key,
      stringifyInitiatives(nextInitiatives)
    );
  };

  return (
    <Field>
      <FieldLabel>{fieldDef.label}</FieldLabel>
      {fieldDef.description && (
        <FieldDescription>{fieldDef.description}</FieldDescription>
      )}

      <div className="space-y-4">
        {initiatives.map((initiative, initiativeIndex) => (
          <InitiativeItemFields
            key={initiativeIndex}
            initiativeIndex={initiativeIndex}
            initiative={initiative}
            sectionIndex={index}
            fieldKey={fieldDef.key}
            form={form}
            disabled={disabled}
            canRemove={initiatives.length > 1}
            onRemove={() =>
              setInitiatives(
                initiatives.filter((_, itemIndex) => itemIndex !== initiativeIndex)
              )
            }
          />
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() =>
            setInitiatives([...initiatives, createEmptyInitiative()])
          }
        >
          Add Initiative
        </Button>
      </div>
    </Field>
  );
}
