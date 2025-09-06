import { redirect } from "next/navigation";
import AdminPageClient from "./AdminPageClient";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  const { data: userRow, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !userRow?.admin) {
    return redirect("/auth");
  }

  // pass user data to client if needed (has to be plain data)
  return <AdminPageClient />;
}
