import type { Metadata } from "next";

import config from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";

import { requireCmsAccess } from "@/shared/lib/server";

import { importMap } from "../importMap.js";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: Args): Promise<Metadata> => {
  await requireCmsAccess();
  return generatePageMetadata({ config, params, searchParams });
};

export default async function Page({ params, searchParams }: Args) {
  await requireCmsAccess();
  return RootPage({ config, importMap, params, searchParams });
}
