import { redirect } from "next/navigation";
import DepartmentForm from "./DepartmentForm";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDepartmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  const { data: userRow, error } = await supabase
    .from("user")
    .select("admin")
    .eq("id", user.id)
    .single();

  if (error || !userRow?.admin) {
    return redirect("/auth");
  }

  return (
    <div className="bg-white text-black pt-24 pb-8 sm:pt-12 sm:pb-10">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Departments</h1>
          <p className="text-gray-600">
            Create new department pages or edit existing ones without a full
            CMS.
          </p>
        </div>
        <DepartmentForm />
      </div>
    </div>
  );
}
