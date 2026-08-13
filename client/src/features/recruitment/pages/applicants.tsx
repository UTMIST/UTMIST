import { requireAdmin } from "@/shared/lib/server";
import ApplicantsPageClient from "@/features/recruitment/components/ApplicantsPageClient";

// Applicant records are PII. This page is admin-only — see shared/lib/auth/guards.ts.
export default async function ApplicantsPage() {
  await requireAdmin();

  return <ApplicantsPageClient />;
}
