"use client";

import { renderPageSection } from "@/components/department/renderDepartmentSection";
import type { DepartmentPage } from "@/types/departments";
import type { MemberRecord } from "@/utils/members";

interface DepartmentPageRendererProps {
  page: DepartmentPage;
  memberRowsBySlotKey: Record<string, MemberRecord[]>;
}

export default function DepartmentPageRenderer({
  page,
  memberRowsBySlotKey,
}: DepartmentPageRendererProps) {
  return (
    <>
      <div className="mx-auto mb-32 mt-20 flex max-w-4xl flex-col justify-center gap-1 text-center">
        <h1 className="text-5xl">{page.name}</h1>
        {page.tagline?.trim() && <p>{page.tagline}</p>}
      </div>
      <main className="mx-auto mb-32 mt-20 flex max-w-5xl flex-col justify-center gap-y-15 text-center">
        {page.sections.map((section, index) => (
          <div key={`${section.component}-${index}`}>
            {renderPageSection({
              section,
              sectionIndex: index,
              memberRowsBySlotKey,
            })}
          </div>
        ))}
      </main>
    </>
  );
}
