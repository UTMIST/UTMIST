import type { ServerFunctionClient } from "payload";
import React from "react";

import config from "@payload-config";
import {
  handleServerFunctions,
  RootLayout,
} from "@payloadcms/next/layouts";
import "@payloadcms/next/css";

import { importMap } from "./cms/importMap.js";

const serverFunction: ServerFunctionClient = async (args) => {
  "use server";

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

export default function PayloadLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
