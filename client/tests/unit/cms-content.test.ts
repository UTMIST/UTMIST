/** @jest-environment node */
import { z } from "zod";

import { readCmsContent } from "@/shared/lib/content/cms";

const mockRead = jest.fn();
const mockEvaluate = jest.fn();
const mockConnection = jest.fn();
jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("next/server", () => ({ connection: () => mockConnection() }));
jest.mock("@/shared/lib/flags/server", () => ({
  evaluateFlag: (...args: unknown[]) => mockEvaluate(...args),
}));
jest.mock("@/shared/lib/content/payload", () => ({
  payloadContentReader: { read: (...args: unknown[]) => mockRead(...args) },
}));

const definition = {
  key: "test-section",
  schema: z.object({ heading: z.string() }),
};
const fallback = { heading: "Static fallback" };
const edited = { heading: "Edited in Payload" };
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv, NODE_ENV: "development" };
  delete process.env.VERCEL;
  delete process.env.VERCEL_ENV;
  jest.clearAllMocks();
  mockEvaluate.mockResolvedValue(true);
  mockRead.mockResolvedValue({ status: "found", content: edited });
});

afterEach(() => { process.env = originalEnv; });

describe("shared CMS content source", () => {
  it.each([
    { name: "standalone production", env: { NODE_ENV: "production" } },
    { name: "test", env: { NODE_ENV: "test" } },
    { name: "Vercel Development", env: { NODE_ENV: "development", VERCEL: "1", VERCEL_ENV: "development" } },
    { name: "Vercel Production", env: { NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "production" } },
  ] as const)("always uses fallback content in $name", async ({ env }) => {
    process.env = { ...process.env, ...env };

    await expect(readCmsContent({ definition, fallback })).resolves.toBe(fallback);
    expect(mockConnection).not.toHaveBeenCalled();
    expect(mockEvaluate).not.toHaveBeenCalled();
    expect(mockRead).not.toHaveBeenCalled();
  });

  it.each([
    { name: "local development", env: { NODE_ENV: "development" } },
    { name: "Vercel Preview", env: { NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "preview" } },
  ] as const)("uses fallback content without opening Payload when access is Off in $name", async ({ env }) => {
    process.env = { ...process.env, ...env };
    mockEvaluate.mockResolvedValue(false);

    await expect(readCmsContent({ definition, fallback })).resolves.toBe(fallback);
    expect(mockConnection).toHaveBeenCalledTimes(1);
    expect(mockEvaluate).toHaveBeenCalledWith("CMS-Access");
    expect(mockRead).not.toHaveBeenCalled();
  });

  it.each([
    { name: "local development", env: { NODE_ENV: "development" } },
    { name: "Vercel Preview", env: { NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "preview" } },
  ] as const)("returns validated Payload content when access is On in $name", async ({ env }) => {
    process.env = { ...process.env, ...env };

    await expect(readCmsContent({ definition, fallback })).resolves.toBe(edited);
    expect(mockConnection).toHaveBeenCalledTimes(1);
    expect(mockEvaluate).toHaveBeenCalledWith("CMS-Access");
    expect(mockRead).toHaveBeenCalledWith(definition);
  });

  it.each([
    { status: "missing" },
    { status: "error", reason: "unavailable" },
    { status: "error", reason: "invalid-content" },
  ])("surfaces opted-in CMS failure instead of silently using fallback (%j)", async (result) => {
    mockRead.mockResolvedValue(result);

    await expect(readCmsContent({ definition, fallback })).rejects.toThrow("CMS content");
  });
});
