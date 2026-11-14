/** @jest-environment node */
import { contentOrThrow } from "@/shared/lib/content/reader";
import { createFixtureContentReader } from "@/shared/lib";
import { homeImpactContent, homeImpactDefinition } from "@/features/public-site/data/home-impact";
import { readHomeImpact } from "@/features/public-site/lib/home-impact";

const mockReadCmsContent = jest.fn();
jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@/shared/lib/server", () => ({
  readCmsContent: (options: unknown) => mockReadCmsContent(options),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockReadCmsContent.mockResolvedValue(homeImpactContent);
});

describe("home impact content source", () => {
  it("binds its definition and fallback to the shared CMS source", async () => {
    const edited = { ...homeImpactContent, heading: "Synthetic hosted edit" };
    mockReadCmsContent.mockResolvedValue(edited);

    await expect(readHomeImpact()).resolves.toBe(edited);
    expect(mockReadCmsContent).toHaveBeenCalledWith({
      definition: homeImpactDefinition,
      fallback: homeImpactContent,
    });
  });

  it("reuses existing content through the same contract offline", async () => {
    const fixture = createFixtureContentReader([{ key: homeImpactDefinition.key, status: "published", ...homeImpactContent }]);
    const content = contentOrThrow(await fixture.read(homeImpactDefinition));
    expect(content).toEqual(homeImpactContent);
    expect(mockReadCmsContent).not.toHaveBeenCalled();
  });

  it("requires at least one statistic for this consumer", async () => {
    const fixture = createFixtureContentReader([{ key: homeImpactDefinition.key, status: "published", heading: "Synthetic" }]);
    expect(await fixture.read(homeImpactDefinition)).toEqual({ status: "error", reason: "invalid-content" });
  });
});
