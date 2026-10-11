import type { ServerFunctionClient } from "payload";
import React from "react";

import config from "@payload-config";
import {
  handleServerFunctions,
  RootLayout,
} from "@payloadcms/next/layouts";
import "@payloadcms/next/css";

import { requireCmsAccess } from "@/shared/lib/server";

import { importMap } from "./cms/importMap.js";

export const dynamic = "force-dynamic";

const serverFunction: ServerFunctionClient = async (args) => {
  "use server";

  await requireCmsAccess();
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

export default async function PayloadLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireCmsAccess();
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
