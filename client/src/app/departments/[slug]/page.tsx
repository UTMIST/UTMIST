import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { parseSelectedDepartments } from "@/app/admin/departments/sectionData";
import DepartmentPageRenderer from "@/components/department/DepartmentPageRenderer";
import { createClient } from "@/lib/supabase/server";
import { getDepartmentPageBySlug } from "@/utils/departments";
import {
  buildMemberGroups,
  fetchMembersForDepartments,
  filterMemberRowsForDepartments,
} from "@/utils/members";

type DepartmentSlugPageProps = {
  params: Promise<{ slug: string }>;
};

async function loadDepartmentPage(slug: string) {
  const supabase = await createClient();
  const { data: page, error } = await getDepartmentPageBySlug(supabase, slug);

  if (error) {
    throw new Error(error);
  }

  if (!page) {
    notFound();
  }

  const selectedDepartments = new Set<string>();
  page.sections.forEach((section) => {
    if (section.component !== "member_list") {
      return;
    }

    parseSelectedDepartments(section.data.departments ?? "").forEach(
      (department) => selectedDepartments.add(department)
    );
  });

  const { data: memberRows } =
    selectedDepartments.size > 0
      ? await fetchMembersForDepartments(supabase, [...selectedDepartments])
      : { data: [] };

  const memberGroupsBySectionIndex = Object.fromEntries(
    page.sections.map((section, index) => {
      if (section.component !== "member_list") {
        return [index, []];
      }

      const departments = parseSelectedDepartments(
        section.data.departments ?? ""
      );
      const sectionRows = filterMemberRowsForDepartments(memberRows, departments);

      return [index, buildMemberGroups(sectionRows)];
    })
  );

  return { page, memberGroupsBySectionIndex };
}

export async function generateMetadata({
  params,
}: DepartmentSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: page } = await getDepartmentPageBySlug(supabase, slug);

  if (!page) {
    return { title: "Department Not Found" };
  }

  return {
    title: page.name,
    description: page.tagline || undefined,
  };
}

export default async function DepartmentSlugPage({
  params,
}: DepartmentSlugPageProps) {
  const { slug } = await params;
  const { page, memberGroupsBySectionIndex } = await loadDepartmentPage(slug);

  return (
    <DepartmentPageRenderer
      page={page}
      memberGroupsBySectionIndex={memberGroupsBySectionIndex}
    />
  );
}
