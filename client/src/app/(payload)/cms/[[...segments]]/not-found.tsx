import config from "@payload-config";
import { NotFoundPage } from "@payloadcms/next/views";

import { requireCmsAccess } from "@/shared/lib/server";

import { importMap } from "../importMap.js";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function NotFound({ params, searchParams }: Args) {
  await requireCmsAccess();
  return NotFoundPage({ config, importMap, params, searchParams });
}
