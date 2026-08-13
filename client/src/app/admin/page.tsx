import AdminPageClient from "./AdminPageClient";
import AddCalendly from "./AddCalendly";
import { requireAdmin } from "@/shared/lib/server";

export default async function AdminPage() {
  const userRow = await requireAdmin();

  // pass user data to client if needed (has to be plain data)
  return (
    <>
      <AddCalendly userId={userRow.id} calendly={userRow.calendly ?? ""} />
      <AdminPageClient />
    </>
  );
}
