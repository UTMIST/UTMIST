"use client";

import { parseInitiatives } from "@/app/admin/departments/initiativeFields";
import { MarkdownSection } from "@/components/department/MarkdownSection";
import { ProjectGallerySection } from "@/components/department/ProjectGallerySection";
import { InitiativeCard, InitiativeList } from "@/components/initiatives";
import { MemberList } from "@/components/memberList";
import type {
  DepartmentPage,
  DepartmentPageSection,
} from "@/types/departments";
import type { MemberRecord } from "@/utils/members";

interface DepartmentSectionProps {
  section: DepartmentPageSection;
  memberRows: MemberRecord[];
}

function DepartmentSection({ section, memberRows }: DepartmentSectionProps) {
  const data = section.data;

  switch (section.component) {
    case "text_section":
      return (
        <section className="w-full text-left">
          {data.heading?.trim() && (
            <h2 className="text-3xl">{data.heading}</h2>
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
          memberRows={memberRows}
          title={data.title || "Member List"}
          subtitle={data.subtitle || "See who makes us special!"}
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

interface DepartmentPageRendererProps {
  page: DepartmentPage;
  memberRowsBySectionIndex: Record<number, MemberRecord[]>;
}

export default function DepartmentPageRenderer({
  page,
  memberRowsBySectionIndex,
}: DepartmentPageRendererProps) {
  return (
    <>
      <div className="mx-auto mb-32 mt-20 flex max-w-4xl flex-col justify-center gap-1 text-center">
        <h1 className="text-5xl">{page.name}</h1>
        {page.tagline?.trim() && <p>{page.tagline}</p>}
      </div>
      <main className="mx-auto mb-32 mt-20 flex max-w-5xl flex-col justify-center gap-y-15 text-center">
        {page.sections.map((section, index) => (
          <DepartmentSection
            key={`${section.component}-${index}`}
            section={section}
            memberRows={memberRowsBySectionIndex[index] ?? []}
          />
        ))}
      </main>
    </>
  );
}
