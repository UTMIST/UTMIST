import * as v from "valibot";

import { DEPARTMENT_COMPONENT_REGISTRY } from "@/app/admin/departments/componentRegistry";

const SectionSchema = v.object({
  component: v.pipe(
    v.string(),
    v.minLength(1, "Select a component type."),
    v.check(
      (value) =>
        DEPARTMENT_COMPONENT_REGISTRY.some((component) => component.id === value),
      "Choose a valid component type."
    )
  ),
  dataJson: v.string(),
});

export const DepartmentFormSchema = v.object({
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
  slug: v.pipe(
    v.string(),
    v.minLength(2, "URL slug must be at least 2 characters."),
    v.maxLength(100, "URL slug must be at most 100 characters."),
    v.regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only (e.g. department-of-infrastructure)."
    )
  ),
  sections: v.pipe(
    v.array(SectionSchema)
  ),
});
