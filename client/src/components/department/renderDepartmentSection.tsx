"use client";

import { parseInitiatives } from "@/app/admin/departments/initiativeFields";
import { TWO_COLUMN_ROW_ID } from "@/app/admin/departments/componentRegistry";
import {
  getColumnComponent,
  getColumnDataJson,
  parseNestedSection,
} from "@/app/admin/departments/nestedSectionData";
import { MarkdownSection } from "@/components/department/MarkdownSection";
import { ProjectGallerySection } from "@/components/department/ProjectGallerySection";
import { InitiativeCard, InitiativeList } from "@/components/initiatives";
import { MemberFaces } from "@/components/memberFaces";
import { MemberList } from "@/components/memberList";
import type { DepartmentPageSection } from "@/types/departments";
import type { MemberRecord } from "@/utils/members";

interface RenderDepartmentSectionOptions {
  section: DepartmentPageSection;
  memberRowsBySlotKey: Record<string, MemberRecord[]>;
  slotKey: string;
}

export function renderDepartmentSection({
  section,
  memberRowsBySlotKey,
  slotKey,
}: RenderDepartmentSectionOptions) {
  const data = section.data;

  switch (section.component) {
    case "text_section":
      return (
        <section className="w-full text-left">
          {data.heading?.trim() && (
            <h2 className="text-3xl pb-4">{data.heading}</h2>
          )}
          {data.body?.trim() && <p className="w-full">{data.body}</p>}
        </section>
      );

    case "markdown_section":
      return (
        <MarkdownSection heading={data.heading} content={data.content ?? ""} />
      );

    case "member_list":
      return (
        <MemberList
          memberRows={memberRowsBySlotKey[slotKey] ?? []}
          title={data.title || "Member List"}
          subtitle={data.subtitle || "See who makes us special!"}
        />
      );

    case "member_faces":
      return (
        <MemberFaces
          memberRows={memberRowsBySlotKey[slotKey] ?? []}
          title={data.title}
          subtitle={data.subtitle}
        />
      );

    case "initiative_list": {
      const initiatives = parseInitiatives(data.initiatives ?? "[]").filter(
        (initiative) =>
          initiative.title.trim() ||
          initiative.description.trim() ||
          initiative.projectLink.trim() ||
          initiative.image.trim()
      );

      if (initiatives.length === 0) {
        return null;
      }

      return <InitiativeList initiatives={initiatives} />;
    }

    case "initiative_card":
      if (!data.title?.trim() && !data.description?.trim()) {
        return null;
      }

      return (
        <InitiativeCard
          title={data.title ?? ""}
          description={data.description ?? ""}
          projectLink={data.projectLink ?? "#"}
          image={data.image ?? "file.svg"}
        />
      );

    case "project_gallery":
      return (
        <ProjectGallerySection
          title={data.title}
          subtitle={data.subtitle}
          searchPlaceholder={data.searchPlaceholder}
        />
      );

    default:
      return null;
  }
}

interface RenderTwoColumnRowOptions {
  section: DepartmentPageSection;
  memberRowsBySlotKey: Record<string, MemberRecord[]>;
  sectionIndex: number;
}

export function renderTwoColumnRow({
  section,
  memberRowsBySlotKey,
  sectionIndex,
}: RenderTwoColumnRowOptions) {
  const columns = (["left", "right"] as const).map((column) => {
    const componentId = getColumnComponent(section.data, column);
    if (!componentId) {
      return null;
    }

    const nestedSection = parseNestedSection(
      componentId,
      getColumnDataJson(section.data, column)
    );

    return (
      <div key={column} className="min-w-0 flex-1">
        {renderDepartmentSection({
          section: nestedSection,
          memberRowsBySlotKey,
          slotKey: `${sectionIndex}-${column}`,
        })}
      </div>
    );
  });

  return (
    <section className="flex w-full flex-col gap-8 text-left lg:flex-row lg:items-start lg:gap-x-40 lg:gap-y-8">
      {columns}
    </section>
  );
}

export function renderPageSection({
  section,
  sectionIndex,
  memberRowsBySlotKey,
}: {
  section: DepartmentPageSection;
  sectionIndex: number;
  memberRowsBySlotKey: Record<string, MemberRecord[]>;
}) {
  if (section.component === TWO_COLUMN_ROW_ID) {
    return renderTwoColumnRow({
      section,
      memberRowsBySlotKey,
      sectionIndex,
    });
  }

  return renderDepartmentSection({
    section,
    memberRowsBySlotKey,
    slotKey: String(sectionIndex),
  });
}
