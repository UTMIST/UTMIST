"use client";

import { useEffect, useMemo, useState } from "react";
import { XIcon } from "lucide-react";
import type { FormStore } from "@formisch/react";

import type { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";
import type { ComponentFieldDef } from "@/app/admin/departments/componentRegistry";
import {
  parseSelectedDepartments,
  stringifySelectedDepartments,
} from "@/app/admin/departments/sectionData";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { listMemberDepartments } from "@/utils/members";

import {
  getSectionDataFieldValue,
  updateSectionDataField,
} from "./sectionDataField";

interface MemberDepartmentMultiSelectFieldProps {
  fieldDef: ComponentFieldDef;
  index: number;
  form: FormStore<typeof DepartmentFormSchema>;
  disabled?: boolean;
}

export default function MemberDepartmentMultiSelectField({
  fieldDef,
  index,
  form,
  disabled,
}: MemberDepartmentMultiSelectFieldProps) {
  const fieldId = `admin-section-${index}-${fieldDef.key}`;
  const storedValue = getSectionDataFieldValue(form, index, fieldDef.key);
  const selected = useMemo(
    () => parseSelectedDepartments(storedValue),
    [storedValue]
  );

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      const { data, error } = await listMemberDepartments();

      if (cancelled) {
        return;
      }

      setOptions(data);
      setLoadError(error);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((department) =>
      department.toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  const setSelected = (nextSelected: string[]) => {
    updateSectionDataField(
      form,
      index,
      fieldDef.key,
      stringifySelectedDepartments(nextSelected)
    );
  };

  const toggleDepartment = (department: string) => {
    if (disabled) {
      return;
    }

    if (selected.includes(department)) {
      setSelected(selected.filter((value) => value !== department));
      return;
    }

    setSelected([...selected, department]);
  };

  const removeDepartment = (department: string) => {
    if (disabled) {
      return;
    }

    setSelected(selected.filter((value) => value !== department));
  };

  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{fieldDef.label}</FieldLabel>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((department) => (
            <span
              key={department}
              className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-sm"
            >
              {department}
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-background disabled:opacity-50"
                onClick={() => removeDepartment(department)}
                disabled={disabled}
                aria-label={`Remove ${department}`}
              >
                <XIcon className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Input
        id={fieldId}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search departments..."
        autoComplete="off"
        disabled={disabled || loading}
      />

      <div className="max-h-48 overflow-y-auto rounded-md border">
        {loading && (
          <p className="px-3 py-2 text-sm text-muted-foreground">
            Loading departments...
          </p>
        )}

        {!loading && loadError && (
          <p className="px-3 py-2 text-sm text-red-500">{loadError}</p>
        )}

        {!loading && !loadError && filteredOptions.length === 0 && (
          <p className="px-3 py-2 text-sm text-muted-foreground">
            {options.length === 0
              ? "No departments found in the Members table."
              : "No departments match your search."}
          </p>
        )}

        {!loading &&
          !loadError &&
          filteredOptions.map((department) => {
            const isSelected = selected.includes(department);

            return (
              <Button
                key={department}
                type="button"
                variant="ghost"
                className={cn(
                  "h-auto w-full justify-start rounded-none px-3 py-2 text-left font-normal",
                  isSelected && "bg-muted"
                )}
                onClick={() => toggleDepartment(department)}
                disabled={disabled}
                aria-pressed={isSelected}
              >
                <span className="truncate">{department}</span>
              </Button>
            );
          })}
      </div>

      {fieldDef.description && (
        <FieldDescription>{fieldDef.description}</FieldDescription>
      )}
      <FieldDescription>
        {selected.length} department{selected.length === 1 ? "" : "s"} selected.
      </FieldDescription>
    </Field>
  );
}
