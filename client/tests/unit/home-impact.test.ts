/** @jest-environment node */
import { contentOrThrow } from "@/shared/lib/content/reader";
import { createFixtureContentReader } from "@/shared/lib";
import { homeImpactContent, homeImpactDefinition } from "@/features/public-site/data/home-impact";
import { readHomeImpact } from "@/features/public-site/lib/home-impact";

const mockRead = jest.fn();
const mockEvaluate = jest.fn();
const mockConnection = jest.fn();
jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("next/server", () => ({ connection: () => mockConnection() }));
jest.mock("@/shared/lib/server", () => ({
  contentOrThrow: jest.requireActual("@/shared/lib/content/reader").contentOrThrow,
  payloadContentReader: { read: (...args: unknown[]) => mockRead(...args) },
  evaluateFlag: (...args: unknown[]) => mockEvaluate(...args),
}));

const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv, NODE_ENV: "development" };
  delete process.env.VERCEL;
  delete process.env.VERCEL_ENV;
  jest.clearAllMocks();
  mockEvaluate.mockResolvedValue(true);
});
afterEach(() => { process.env = originalEnv; });

describe("home impact content source", () => {
  it.each(["production", "test"] as const)("keeps the existing deployed content in %s without selecting a fixture adapter", async (env) => {
    process.env = { ...process.env, NODE_ENV: env };
    expect(await readHomeImpact()).toBe(homeImpactContent);
    expect(mockEvaluate).not.toHaveBeenCalled();
    expect(mockRead).not.toHaveBeenCalled();
  });

  it("does not opt into local content on a Vercel deployment", async () => {
    process.env.VERCEL_ENV = "development";
    expect(await readHomeImpact()).toBe(homeImpactContent);
    expect(mockRead).not.toHaveBeenCalled();
  });

  it("keeps the original content while the local availability flag is Off", async () => {
    mockEvaluate.mockResolvedValue(false);
    expect(await readHomeImpact()).toBe(homeImpactContent);
    expect(mockRead).not.toHaveBeenCalled();
  });

  it("makes opted-in reads dynamic and passes edited content through", async () => {
    const edited = { ...homeImpactContent, heading: "Synthetic local edit" };
    mockRead.mockResolvedValue({ status: "found", content: edited });
    expect(await readHomeImpact()).toBe(edited);
    expect(mockConnection).toHaveBeenCalled();
    expect(mockRead).toHaveBeenCalledWith(homeImpactDefinition);
    expect(mockEvaluate).toHaveBeenCalledWith("CMS-Access");
  });

  it.each([
    { status: "missing" },
    { status: "error", reason: "unavailable" },
    { status: "error", reason: "invalid-content" },
  ])("surfaces opted-in CMS failure instead of silently falling back (%j)", async (result) => {
    mockRead.mockResolvedValue(result);
    await expect(readHomeImpact()).rejects.toThrow("CMS content");
  });

  it("reuses existing content through the same contract offline", async () => {
    const fixture = createFixtureContentReader([{ key: homeImpactDefinition.key, status: "published", ...homeImpactContent }]);
    const content = contentOrThrow(await fixture.read(homeImpactDefinition));
    expect(content).toEqual(homeImpactContent);
    expect(mockRead).not.toHaveBeenCalled();
  });

  it("requires at least one statistic for this consumer", async () => {
    const fixture = createFixtureContentReader([{ key: homeImpactDefinition.key, status: "published", heading: "Synthetic" }]);
    expect(await fixture.read(homeImpactDefinition)).toEqual({ status: "error", reason: "invalid-content" });
  });
});
