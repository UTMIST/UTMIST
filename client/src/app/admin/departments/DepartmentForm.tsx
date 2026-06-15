"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FieldArray,
  Form,
  Field as FormischField,
  insert,
  remove,
  reset,
  useForm,
} from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";

import SectionBlock from "@/app/admin/departments/SectionBlock";
import { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";
import {
  getDepartmentComponent,
  TWO_COLUMN_ROW_ID,
} from "@/app/admin/departments/componentRegistry";
import {
  getColumnComponent,
  getColumnData,
  validateNestedSectionData,
} from "@/app/admin/departments/nestedSectionData";
import {
  createEmptySectionDataJson,
  toDepartmentPageFormInput,
  toDepartmentPageInput,
} from "@/app/admin/departments/sectionData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
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
import type {
  DepartmentPage,
  DepartmentPageFormInput,
  DepartmentPageInput,
} from "@/types/departments";
import {
  createDepartmentPage,
  listDepartmentPages,
  updateDepartmentPage,
} from "@/utils/departments";

const EMPTY_INPUT: DepartmentPageFormInput = {
  name: "",
  tagline: "",
  slug: "",
  sections: [{ component: "", dataJson: "{}" }],
};

type FormMode = "create" | "edit";

function toFormInput(page: DepartmentPage): DepartmentPageFormInput {
  return toDepartmentPageFormInput(page);
}

function validateSectionJsonFields(
  sections: DepartmentPageInput["sections"]
): string | null {
  for (const [index, section] of sections.entries()) {
    if (section.component === TWO_COLUMN_ROW_ID) {
      for (const column of ["left", "right"] as const) {
        const componentId = getColumnComponent(section.data, column);
        if (!componentId) {
          continue;
        }

        const nestedError = validateNestedSectionData(
          index,
          column,
          componentId,
          getColumnData(section.data, column)
        );
        if (nestedError) {
          return nestedError;
        }
      }
      continue;
    }

    const component = getDepartmentComponent(section.component);
    if (!component) {
      continue;
    }

    for (const fieldDef of component.fields) {
      if (fieldDef.type !== "json") {
        continue;
      }

      const rawValue = section.data[fieldDef.key]?.trim();
      if (!rawValue) {
        return `Section ${index + 1}: ${fieldDef.label} is required.`;
      }

      try {
        JSON.parse(rawValue);
      } catch {
        return `Section ${index + 1}: ${fieldDef.label} must be valid JSON.`;
      }
    }
  }

  return null;
}

export default function DepartmentForm() {
  const [mode, setMode] = useState<FormMode>("create");
  const [pages, setPages] = useState<DepartmentPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [loadingPages, setLoadingPages] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm({
    schema: DepartmentFormSchema,
    initialInput: EMPTY_INPUT,
  });

  const loadPages = useCallback(async () => {
    setLoadingPages(true);
    const { data, error } = await listDepartmentPages();
    setLoadingPages(false);

    if (error) {
      setMsg({ type: "error", text: error });
      return;
    }

    setPages(data);
  }, []);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  const applyFormInput = useCallback(
    (input: DepartmentPageFormInput) => {
      reset(form, { initialInput: input });
      setMsg(null);
    },
    [form]
  );

  const handleModeChange = (nextMode: FormMode) => {
    setMode(nextMode);
    setSelectedPageId("");
    applyFormInput(EMPTY_INPUT);
  };

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    const page = pages.find((entry) => entry.id === pageId);

    if (page) {
      applyFormInput(toFormInput(page));
    }
  };

  const handleSubmit: SubmitHandler<typeof DepartmentFormSchema> = async (
    output
  ) => {
    if (mode === "edit" && !selectedPageId) {
      setMsg({
        type: "error",
        text: "Select a department page to edit.",
      });
      return;
    }

    const pageInput = toDepartmentPageInput(output);

    const jsonError = validateSectionJsonFields(pageInput.sections);
    if (jsonError) {
      setMsg({ type: "error", text: jsonError });
      return;
    }

    setSubmitting(true);
    setMsg(null);

    const result =
      mode === "create"
        ? await createDepartmentPage(pageInput)
        : await updateDepartmentPage(selectedPageId, pageInput);

    setSubmitting(false);

    if (result.error || !result.data) {
      setMsg({
        type: "error",
        text: result.error ?? "Failed to save department page.",
      });
      return;
    }

    setMsg({
      type: "success",
      text:
        mode === "create"
          ? `Department page "${result.data.name}" created successfully.`
          : `New version of "${result.data.name}" saved successfully.`,
    });

    await loadPages();

    if (mode === "create") {
      applyFormInput(EMPTY_INPUT);
      return;
    }

    setSelectedPageId(result.data.id);
    applyFormInput(toFormInput(result.data));
  };

  const isEditMode = mode === "edit";
  const formDisabled = isEditMode && !selectedPageId;
  const canSubmit = !submitting && (!isEditMode || Boolean(selectedPageId));

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Department Pages</CardTitle>
        <CardDescription>
          Set the page header, then build the rest of the page by adding content
          sections. Each section maps to a component on the public department
          page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="admin-department-mode">
              What would you like to do?
            </FieldLabel>
            <Select
              value={mode}
              onValueChange={(value) => handleModeChange(value as FormMode)}
            >
              <SelectTrigger id="admin-department-mode">
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create">
                  Create a new department page
                </SelectItem>
                <SelectItem value="edit">
                  Edit an existing department page
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Pick whether you are adding a new page or updating one that
              already exists.
            </FieldDescription>
          </Field>

          {isEditMode && (
            <Field>
              <FieldLabel htmlFor="admin-department-select">
                Select department page
              </FieldLabel>
              <Select
                value={selectedPageId}
                onValueChange={handlePageSelect}
                disabled={loadingPages}
              >
                <SelectTrigger id="admin-department-select">
                  <SelectValue
                    placeholder={
                      loadingPages
                        ? "Loading pages..."
                        : pages.length === 0
                          ? "No pages available"
                          : "Choose a department page"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                {pages.length === 0 && !loadingPages
                  ? "No department pages exist yet. Switch to create mode to add one."
                  : "The form below will fill in with the saved content for this page."}
              </FieldDescription>
            </Field>
          )}
        </FieldGroup>

        <Form of={form} id="admin-department-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <FormischField of={form} path={["name"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="admin-department-name">
                    Department Name
                  </FieldLabel>
                  <Input
                    {...field.props}
                    id="admin-department-name"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="Department of Infrastructure"
                    autoComplete="off"
                    disabled={formDisabled}
                  />
                  <FieldDescription>
                    The full display name shown at the top of the department
                    page.
                  </FieldDescription>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>

            <FormischField of={form} path={["tagline"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="admin-department-tagline">
                    Tagline
                  </FieldLabel>
                  <Input
                    {...field.props}
                    id="admin-department-tagline"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="We make the tools that lets UTMIST members be awesome!"
                    autoComplete="off"
                    disabled={formDisabled}
                  />
                  <FieldDescription>
                    A short subtitle displayed below the department name.
                  </FieldDescription>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>

            <FormischField of={form} path={["slug"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="admin-department-slug">
                    URL Slug
                  </FieldLabel>
                  <Input
                    {...field.props}
                    id="admin-department-slug"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="department-of-infrastructure"
                    autoComplete="off"
                    disabled={formDisabled}
                  />
                  <FieldDescription>
                    Used in the page URL, e.g. /departments/
                    {field.input?.trim() || "your-slug"}
                  </FieldDescription>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>

            <FieldArray of={form} path={["sections"]}>
              {(fieldArray) => (
                <FieldSet className="gap-4">
                  <FieldLegend variant="label">Page Content Sections</FieldLegend>
                  <FieldDescription>
                    Add sections in the order they should appear on the page.
                    Each section uses one of your custom components.
                  </FieldDescription>

                  <FieldGroup className="gap-4">
                    {fieldArray.items.map((item, index) => (
                      <SectionBlock
                        key={item}
                        form={form}
                        index={index}
                        disabled={formDisabled}
                        canRemove={fieldArray.items.length > 1}
                        onRemove={() =>
                          remove(form, { path: ["sections"], at: index })
                        }
                      />
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={formDisabled}
                      onClick={() =>
                        insert(form, {
                          path: ["sections"],
                          initialInput: {
                            component: "",
                            dataJson: createEmptySectionDataJson(""),
                          },
                        })
                      }
                    >
                      Add Section
                    </Button>
                  </FieldGroup>

                  {fieldArray.errors && (
                    <FieldError
                      errors={fieldArray.errors.map((message) => ({ message }))}
                    />
                  )}
                </FieldSet>
              )}
            </FieldArray>
          </FieldGroup>
        </Form>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (isEditMode && selectedPageId) {
                const page = pages.find((entry) => entry.id === selectedPageId);
                if (page) {
                  applyFormInput(toFormInput(page));
                  return;
                }
              }

              applyFormInput(EMPTY_INPUT);
              setSelectedPageId("");
            }}
            disabled={submitting}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="admin-department-form"
            disabled={!canSubmit}
          >
            {submitting
              ? "Saving..."
              : isEditMode
                ? "Save New Version"
                : "Create Department Page"}
          </Button>
        </Field>
        {msg && (
          <span
            className={`text-sm ${
              msg.type === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {msg.text}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
