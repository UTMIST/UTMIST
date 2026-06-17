import {
  createEmptyInitiative,
  INITIATIVE_ITEM_FIELDS,
  stringifyInitiatives,
} from "@/app/admin/departments/initiativeFields";

export const TWO_COLUMN_ROW_ID = "two_column_row";

export function createEmptyTwoColumnSectionData(): Record<string, string> {
  return {
    leftComponent: "",
    leftDataJson: "{}",
    rightComponent: "",
    rightDataJson: "{}",
  };
}

export type ComponentFieldType =
  | "text"
  | "textarea"
  | "url"
  | "json"
  | "markdown"
  | "member_department_multi_select"
  | "initiative_repeater";

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
    id: "markdown_section",
    label: "Markdown Section",
    description: "Rich text content rendered from Markdown.",
    fields: [
      {
        key: "heading",
        label: "Heading",
        type: "text",
        placeholder: "Optional section heading",
      },
      {
        key: "content",
        label: "Markdown Content",
        type: "markdown",
        placeholder: "## Hello\n\nWrite **markdown** here...",
        description:
          "Supports headings, lists, links, bold, italic, and more.",
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
    id: "member_faces",
    label: "Member Faces",
    description:
      "Searchable grid of member profile photos with social links.",
    fields: [
      {
        key: "title",
        label: "Section Title",
        type: "text",
        placeholder: "Meet the Team",
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
        label: "Initiatives",
        type: "initiative_repeater",
        description: "Add one or more initiative cards to this list.",
      },
    ],
  },
  {
    id: "initiative_card",
    label: "Single Initiative Card",
    description: "One featured initiative with image and outbound link.",
    fields: INITIATIVE_ITEM_FIELDS,
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
  {
    id: TWO_COLUMN_ROW_ID,
    label: "Two Column Row",
    description: "Place two components side by side in one row.",
    fields: [],
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
  if (componentId === TWO_COLUMN_ROW_ID) {
    return createEmptyTwoColumnSectionData();
  }

  const component = getDepartmentComponent(componentId);
  if (!component) {
    return {};
  }

  return Object.fromEntries(
    component.fields.map((field) => {
      if (field.type === "member_department_multi_select") {
        return [field.key, "[]"];
      }

      if (field.type === "initiative_repeater") {
        return [field.key, stringifyInitiatives([createEmptyInitiative()])];
      }

      return [field.key, ""];
    })
  );
}
