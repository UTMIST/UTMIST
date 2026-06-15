export type ComponentFieldType =
  | "text"
  | "textarea"
  | "url"
  | "json"
  | "member_department_multi_select";

export interface ComponentFieldDef {
  key: string;
  label: string;
  type: ComponentFieldType;
  placeholder?: string;
  description?: string;
}

export interface DepartmentComponentDef {
  id: string;
  label: string;
  description: string;
  fields: ComponentFieldDef[];
}

export const DEPARTMENT_COMPONENT_REGISTRY: DepartmentComponentDef[] = [
  {
    id: "text_section",
    label: "Text Section",
    description: 'A heading with paragraph text (e.g. "What do we do?").',
    fields: [
      {
        key: "heading",
        label: "Heading",
        type: "text",
        placeholder: "What do we do?",
      },
      {
        key: "body",
        label: "Body",
        type: "textarea",
        placeholder: "Describe this section...",
      },
    ],
  },
  {
    id: "member_list",
    label: "Member List",
    description: "Searchable member list grouped by role.",
    fields: [
      {
        key: "title",
        label: "Section Title",
        type: "text",
        placeholder: "Member List",
      },
      {
        key: "subtitle",
        label: "Subtitle",
        type: "text",
        placeholder: "See who makes us special!",
      },
      {
        key: "departments",
        label: "Departments",
        type: "member_department_multi_select",
        description:
          "Search and select member departments from the Members table.",
      },
    ],
  },
  {
    id: "initiative_list",
    label: "Initiative List",
    description: "A vertical list of initiative cards.",
    fields: [
      {
        key: "initiatives",
        label: "Initiatives Data",
        type: "json",
        description:
          'JSON array of { "title", "description", "projectLink", "image" }',
        placeholder:
          '[{"title":"UTMIST Website","description":"...","projectLink":"#","image":"file.svg"}]',
      },
    ],
  },
  {
    id: "initiative_card",
    label: "Single Initiative Card",
    description: "One featured initiative with image and outbound link.",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "projectLink",
        label: "Project Link",
        type: "url",
        placeholder: "https://...",
      },
      {
        key: "image",
        label: "Image URL",
        type: "text",
        placeholder: "file.svg or https://...",
      },
    ],
  },
  {
    id: "project_gallery",
    label: "Project Gallery",
    description: "Project carousel section with title and search bar.",
    fields: [
      {
        key: "title",
        label: "Gallery Title",
        type: "text",
        placeholder: "Project Gallery",
      },
      {
        key: "subtitle",
        label: "Subtitle",
        type: "text",
        placeholder: "Check out our awesome stuff!",
      },
      {
        key: "searchPlaceholder",
        label: "Search Placeholder",
        type: "text",
        placeholder: "Search projects",
      },
    ],
  },
];

export function getDepartmentComponent(
  componentId: string
): DepartmentComponentDef | undefined {
  return DEPARTMENT_COMPONENT_REGISTRY.find(
    (component) => component.id === componentId
  );
}

export function createEmptySectionData(
  componentId: string
): Record<string, string> {
  const component = getDepartmentComponent(componentId);
  if (!component) {
    return {};
  }

  return Object.fromEntries(
    component.fields.map((field) => [
      field.key,
      field.type === "member_department_multi_select" ? "[]" : "",
    ])
  );
}
