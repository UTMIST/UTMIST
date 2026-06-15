import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { listDepartmentPagesFromDb } from "@/utils/departments";

export default async function DepartmentsIndexPage() {
  const supabase = await createClient();
  const { data: pages, error } = await listDepartmentPagesFromDb(supabase);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="mb-4 text-3xl font-semibold">Departments</h1>
        <p className="text-red-500">Failed to load department pages.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="mb-2 text-center text-4xl font-semibold">Departments</h1>
        <p className="mb-10 text-center text-gray-600">
          Browse UTMIST department pages.
        </p>

        {pages.length === 0 ? (
          <p className="text-center text-gray-500">
            No department pages have been published yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {pages.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/departments/${page.slug}`}
                  className="block rounded-xl border p-5 transition hover:border-[#1E19B1] hover:bg-[#F3F4FF]"
                >
                  <h2 className="text-xl font-semibold text-[#1E19B1]">
                    {page.name}
                  </h2>
                  {page.tagline?.trim() && (
                    <p className="mt-1 text-sm text-gray-600">{page.tagline}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
  );
}
