import { requireAdmin } from "@/lib/auth/guards";
import ApplicantsPageClient from "./ApplicantsPageClient";

// Applicant records are PII. This page is admin-only — see lib/auth/guards.ts.
export default async function ApplicantsPage() {
  await requireAdmin();

  return <ApplicantsPageClient />;
}
