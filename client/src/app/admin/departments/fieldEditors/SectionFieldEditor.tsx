"use client";

import type { FormStore } from "@formisch/react";

import type { DepartmentFormSchema } from "@/app/admin/departments/departmentFormSchema";
import type { ComponentFieldDef } from "@/app/admin/departments/componentRegistry";
import type { SectionFieldAccessor } from "@/app/admin/departments/fieldEditors/fieldEditorTypes";

import DefaultSectionDataField from "./DefaultSectionDataField";
import InitiativeRepeaterField from "./InitiativeRepeaterField";
import MemberDepartmentMultiSelectField from "./MemberDepartmentMultiSelectField";
import ProjectRepeaterField from "./ProjectRepeaterField";

interface SectionFieldEditorProps extends SectionFieldAccessor {
  fieldDef: ComponentFieldDef;
  index: number;
  form: FormStore<typeof DepartmentFormSchema>;
  disabled?: boolean;
}

export default function SectionFieldEditor(props: SectionFieldEditorProps) {
  switch (props.fieldDef.type) {
    case "member_department_multi_select":
      return <MemberDepartmentMultiSelectField {...props} />;
    case "initiative_repeater":
      return <InitiativeRepeaterField {...props} />;
    case "project_repeater":
      return <ProjectRepeaterField {...props} />;
    default:
      return <DefaultSectionDataField {...props} />;
  }
}
