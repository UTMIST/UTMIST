"use client";

import type { FormStore } from "@formisch/react";

import type { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";
import { getDepartmentComponent } from "@/app/admin/departments/componentRegistry";
import type { ColumnSide } from "@/app/admin/departments/nestedSectionData";
import {
  createEmptyColumnDataJson,
  NESTABLE_COMPONENTS,
} from "@/app/admin/departments/nestedSectionData";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getColumnComponentValue,
  getColumnDataFieldValue,
  setColumnComponentValue,
  updateColumnDataField,
} from "./nestedSectionDataField";
import SectionFieldEditor from "./SectionFieldEditor";

interface TwoColumnRowEditorProps {
  form: FormStore<typeof DepartmentFormSchema>;
  index: number;
  disabled?: boolean;
}

function ColumnEditor({
  column,
  label,
  form,
  index,
  disabled,
}: {
  column: ColumnSide;
  label: string;
  form: FormStore<typeof DepartmentFormSchema>;
  index: number;
  disabled?: boolean;
}) {
  const componentId = getColumnComponentValue(form, index, column);
  const selectedComponent = getDepartmentComponent(componentId);

  return (
    <FieldSet className="min-w-0 flex-1 gap-4 rounded-lg border p-4">
      <FieldLegend variant="label">{label}</FieldLegend>

      <Field>
        <FieldLabel htmlFor={`admin-section-${index}-${column}-component`}>
          Component Type
        </FieldLabel>
        <Select
          value={componentId}
          onValueChange={(value) =>
            setColumnComponentValue(
              form,
              index,
              column,
              value,
              createEmptyColumnDataJson(value)
            )
          }
          disabled={disabled}
        >
          <SelectTrigger id={`admin-section-${index}-${column}-component`}>
            <SelectValue placeholder="Choose a component" />
          </SelectTrigger>
          <SelectContent>
            {NESTABLE_COMPONENTS.map((component) => (
              <SelectItem key={component.id} value={component.id}>
                {component.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>
          {selectedComponent?.description ??
            "Pick which block of content to show in this column."}
        </FieldDescription>
      </Field>

      {selectedComponent && (
        <div className="space-y-4 border-t pt-4">
          {selectedComponent.fields.map((fieldDef) => (
            <SectionFieldEditor
              key={fieldDef.key}
              fieldDef={fieldDef}
              index={index}
              form={form}
              disabled={disabled}
              getValue={(fieldKey) =>
                getColumnDataFieldValue(form, index, column, fieldKey)
              }
              setValue={(fieldKey, value) =>
                updateColumnDataField(form, index, column, fieldKey, value)
              }
            />
          ))}
        </div>
      )}
    </FieldSet>
  );
}

export default function TwoColumnRowEditor({
  form,
  index,
  disabled,
}: TwoColumnRowEditorProps) {
  return (
    <div className="space-y-3 border-t pt-4">
      <FieldDescription>
        Place two components side by side on the page, like text on the left and
        a member list on the right.
      </FieldDescription>
      <div className="flex flex-col gap-4 lg:flex-row">
        <ColumnEditor
          column="left"
          label="Left column"
          form={form}
          index={index}
          disabled={disabled}
        />
        <ColumnEditor
          column="right"
          label="Right column"
          form={form}
          index={index}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
