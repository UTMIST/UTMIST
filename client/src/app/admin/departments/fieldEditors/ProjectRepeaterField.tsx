"use client";

import { XIcon } from "lucide-react";
import type { FormStore } from "@formisch/react";

import type { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";
import type { ComponentFieldDef } from "@/app/admin/departments/componentRegistry";
import {
  createEmptyGalleryProject,
  GALLERY_PROJECT_ITEM_FIELDS,
  parseGalleryProjects,
  stringifyGalleryProjects,
  type GalleryProject,
} from "@/app/admin/departments/projectFields";
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
  type SectionFieldAccessor,
  resolveSectionFieldAccessor,
} from "./fieldEditorTypes";

interface ProjectRepeaterFieldProps extends SectionFieldAccessor {
  fieldDef: ComponentFieldDef;
  index: number;
  form: FormStore<typeof DepartmentFormSchema>;
  disabled?: boolean;
}

function ProjectItemFields({
  projectIndex,
  project,
  sectionIndex,
  fieldKey,
  readValue,
  writeValue,
  disabled,
  onRemove,
}: {
  projectIndex: number;
  project: GalleryProject;
  sectionIndex: number;
  fieldKey: string;
  readValue: (fieldKey: string) => string;
  writeValue: (fieldKey: string, value: string) => void;
  disabled?: boolean;
  onRemove: () => void;
}) {
  const updateField = (key: keyof GalleryProject, value: string) => {
    const projects = parseGalleryProjects(readValue(fieldKey));
    const next = [...projects];
    next[projectIndex] = { ...next[projectIndex], [key]: value };
    writeValue(fieldKey, stringifyGalleryProjects(next));
  };

  return (
    <FieldSet className="gap-4 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <FieldLegend variant="label">Project {projectIndex + 1}</FieldLegend>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove project ${projectIndex + 1}`}
        >
          <XIcon className="size-4" />
          Remove
        </Button>
      </div>

      {GALLERY_PROJECT_ITEM_FIELDS.map((itemField) => {
        const fieldId = `admin-section-${sectionIndex}-project-${projectIndex}-${itemField.key}`;
        const value = project[itemField.key as keyof GalleryProject] ?? "";

        return (
          <Field key={itemField.key}>
            <FieldLabel htmlFor={fieldId}>{itemField.label}</FieldLabel>
            {itemField.type === "textarea" ? (
              <Textarea
                id={fieldId}
                value={value}
                onChange={(event) =>
                  updateField(
                    itemField.key as keyof GalleryProject,
                    event.target.value
                  )
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
                  updateField(
                    itemField.key as keyof GalleryProject,
                    event.target.value
                  )
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

export default function ProjectRepeaterField({
  fieldDef,
  index,
  form,
  disabled,
  getValue,
  setValue,
}: ProjectRepeaterFieldProps) {
  const { readValue, writeValue } = resolveSectionFieldAccessor(form, index, {
    getValue,
    setValue,
  });
  const storedValue = readValue(fieldDef.key);
  const projects = parseGalleryProjects(storedValue);

  const setProjects = (nextProjects: GalleryProject[]) => {
    writeValue(fieldDef.key, stringifyGalleryProjects(nextProjects));
  };

  return (
    <Field>
      <FieldLabel>{fieldDef.label}</FieldLabel>
      {fieldDef.description && (
        <FieldDescription>{fieldDef.description}</FieldDescription>
      )}

      <div className="space-y-4">
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No custom projects added. The gallery will show all projects from
            projects.json.
          </p>
        )}

        {projects.map((project, projectIndex) => (
          <ProjectItemFields
            key={projectIndex}
            projectIndex={projectIndex}
            project={project}
            sectionIndex={index}
            fieldKey={fieldDef.key}
            readValue={readValue}
            writeValue={writeValue}
            disabled={disabled}
            onRemove={() =>
              setProjects(
                projects.filter((_, itemIndex) => itemIndex !== projectIndex)
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
            setProjects([...projects, createEmptyGalleryProject()])
          }
        >
          Add Project
        </Button>
      </div>
    </Field>
  );
}
