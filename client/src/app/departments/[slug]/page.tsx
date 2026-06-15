import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { collectMemberListSlots } from "@/app/admin/departments/nestedSectionData";
import DepartmentPageRenderer from "@/components/department/DepartmentPageRenderer";
import { createClient } from "@/lib/supabase/server";
import { getDepartmentPageBySlug } from "@/utils/departments";
import {
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

  const memberListSlots = collectMemberListSlots(page.sections);
  const selectedDepartments = [
    ...new Set(memberListSlots.flatMap((slot) => slot.departments)),
  ];

  const { data: memberRows } =
    selectedDepartments.length > 0
      ? await fetchMembersForDepartments(supabase, selectedDepartments)
      : { data: [] };

  const memberRowsBySlotKey = Object.fromEntries(
    memberListSlots.map((slot) => [
      slot.key,
      filterMemberRowsForDepartments(memberRows, slot.departments),
    ])
  );

  return { page, memberRowsBySlotKey };
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
  const { page, memberRowsBySlotKey } = await loadDepartmentPage(slug);

  return (
    <DepartmentPageRenderer
      page={page}
      memberRowsBySlotKey={memberRowsBySlotKey}
    />
  );
}
