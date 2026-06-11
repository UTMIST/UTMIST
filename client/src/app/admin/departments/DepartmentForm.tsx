"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Form,
  Field as FormischField,
  reset,
  useForm,
} from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";
import * as v from "valibot";

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
import type { DepartmentPage, DepartmentPageInput } from "@/types/departments";
import {
  createDepartmentPage,
  listDepartmentPages,
  updateDepartmentPage,
} from "@/utils/departments";

const EMPTY_INPUT: DepartmentPageInput = {
  name: "",
  tagline: "",
  description: "",
};

const DepartmentFormSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(3, "Department name must be at least 3 characters."),
    v.maxLength(100, "Department name must be at most 100 characters.")
  ),
  tagline: v.pipe(
    v.string(),
    v.minLength(5, "Tagline must be at least 5 characters."),
    v.maxLength(200, "Tagline must be at most 200 characters.")
  ),
  description: v.pipe(
    v.string(),
    v.minLength(20, "Description must be at least 20 characters."),
    v.maxLength(2000, "Description must be at most 2000 characters.")
  ),
});

type FormMode = "create" | "edit";

function toFormInput(page: DepartmentPage): DepartmentPageInput {
  return {
    name: page.name,
    tagline: page.tagline,
    description: page.description,
  };
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
    (input: DepartmentPageInput) => {
      reset(form, { initialInput: input });
      setMsg(null);
    },
    [form]
  );

  const handleModeChange = (nextMode: FormMode) => {
    setMode(nextMode);
    setSelectedPageId("");

    if (nextMode === "create") {
      applyFormInput(EMPTY_INPUT);
      return;
    }

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

    setSubmitting(true);
    setMsg(null);

    const result =
      mode === "create"
        ? await createDepartmentPage(output)
        : await updateDepartmentPage(selectedPageId, output);

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
          : `Department page "${result.data.name}" updated successfully.`,
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
  const canSubmit = !submitting && (!isEditMode || Boolean(selectedPageId));

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Department Pages</CardTitle>
        <CardDescription>
          Create a new department page or edit an existing one. Changes are
          saved to the database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="admin-department-mode">What would you like to do?</FieldLabel>
            <Select
              value={mode}
              onValueChange={(value) => handleModeChange(value as FormMode)}
            >
              <SelectTrigger id="admin-department-mode">
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create">Create a new department page</SelectItem>
                <SelectItem value="edit">Edit an existing department page</SelectItem>
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
                    disabled={isEditMode && !selectedPageId}
                  />
                  <FieldDescription>
                    The full display name shown on the department page.
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
                    disabled={isEditMode && !selectedPageId}
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

            <FormischField of={form} path={["description"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="admin-department-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field.props}
                    id="admin-department-description"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                    placeholder="Describe what this department does..."
                    className="min-h-[120px] resize-y"
                    disabled={isEditMode && !selectedPageId}
                  />
                  <FieldDescription>
                    The &quot;What do we do?&quot; section content for this
                    department.
                  </FieldDescription>
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
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
                ? "Save Changes"
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
