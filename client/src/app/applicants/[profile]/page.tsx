import { requireAdmin } from "@/lib/auth/guards";
import ApplicantProfileClient from "./ApplicantProfileClient";

// Applicant records are PII. This page is admin-only — see lib/auth/guards.ts.
export default async function ApplicantProfilePage() {
  await requireAdmin();

  return <ApplicantProfileClient />;
}
