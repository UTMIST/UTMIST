import { requireAdmin } from "@/shared/lib/server";
import ApplicantProfileClient from "./ApplicantProfileClient";

// Applicant records are PII. This page is admin-only — see shared/lib/auth/guards.ts.
export default async function ApplicantProfilePage() {
  await requireAdmin();

  return <ApplicantProfileClient />;
}
