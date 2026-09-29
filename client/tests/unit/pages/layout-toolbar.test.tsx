/** @jest-environment node */

import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("@vercel/toolbar/next", () => ({
  VercelToolbar: () => <div data-testid="vercel-toolbar" />,
}));
jest.mock("next/script", () => ({ __esModule: true, default: () => null }));
jest.mock("@/shared/lib/server", () => ({
  evaluateFlag: jest.fn().mockResolvedValue(false),
}));
jest.mock("@/shared/ui", () => ({ Footer: () => null }));
jest.mock("@/shared/ui/client", () => ({
  Navbar: () => null,
  ScrollToTop: () => null,
  HideOnEigenAI: ({ children }: { children: ReactNode }) => children,
}));
jest.mock("react-hot-toast", () => ({ Toaster: () => null }));

import RootLayout from "@/app/(frontend)/layout";

const originalEnv = process.env;

describe("frontend toolbar visibility", () => {
  afterEach(() => {
    process.env = originalEnv;
  });

  it.each([
    { name: "local development", nodeEnv: "development", vercelEnv: undefined, visible: true },
    { name: "linked local development", nodeEnv: "development", vercelEnv: "development", visible: true },
    { name: "Preview with platform injection", nodeEnv: "production", vercelEnv: "preview", visible: false },
    { name: "Production", nodeEnv: "production", vercelEnv: "production", visible: false },
    { name: "a standalone production build", nodeEnv: "production", vercelEnv: undefined, visible: false },
    { name: "development with Production credentials", nodeEnv: "development", vercelEnv: "production", visible: false },
    { name: "tests", nodeEnv: "test", vercelEnv: undefined, visible: false },
  ] as const)("renders the expected toolbar in $name", async ({ nodeEnv, vercelEnv, visible }) => {
    process.env = { ...originalEnv, NODE_ENV: nodeEnv };
    if (vercelEnv) process.env.VERCEL_ENV = vercelEnv;
    else delete process.env.VERCEL_ENV;

    const markup = renderToStaticMarkup(
      await RootLayout({ children: <main>Page content</main> }),
    );

    expect(markup).toContain("Page content");
    expect(markup.includes('data-testid="vercel-toolbar"')).toBe(visible);
  });
});
