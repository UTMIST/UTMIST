/** @jest-environment node */
import { z } from "zod";

import { contentSectionSchema, createFixtureContentReader } from "@/shared/lib";
import { payloadContentReader } from "@/shared/lib/content/payload";

const mockFind = jest.fn();
const mockGetPayload = jest.fn(async () => ({ find: mockFind }));
jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("payload", () => ({ getPayload: () => mockGetPayload() }));
jest.mock("../../payload.config", () => ({ __esModule: true, default: {} }));

const definition = { key: "test-section", schema: contentSectionSchema };
const document = { key: definition.key, status: "published" as const, heading: "Synthetic heading" };

beforeEach(() => {
  mockFind.mockReset();
  mockGetPayload.mockClear();
});

describe("typed content readers", () => {
  it("gives fixture and Payload readers the same validated optional-field contract", async () => {
    const row = { ...document, description: null, statistics: null, internalField: "private metadata" };
    mockFind.mockResolvedValue({ docs: [row] });
    const fixture = createFixtureContentReader([row]);
    const expected = { status: "found", content: { heading: row.heading } };
    expect(await payloadContentReader.read(definition)).toEqual(expected);
    expect(await fixture.read(definition)).toEqual(expected);
    expect(mockFind).toHaveBeenCalledWith(expect.objectContaining({
      collection: "content-sections",
      where: { and: [{ key: { equals: definition.key } }, { status: { equals: "published" } }] },
      overrideAccess: false,
      depth: 0,
      limit: 1,
      pagination: false,
    }));
    expect(mockFind.mock.calls[0][0]).not.toHaveProperty("user");
    expect(mockFind.mock.calls[0][0]).not.toHaveProperty("req");
  });

  it("can read another feature's schema and identifier without new access code", async () => {
    const ownDefinition = { key: "other-section", schema: z.object({ heading: z.string(), description: z.string() }) };
    const row = { ...document, key: ownDefinition.key, description: "Another synthetic feature" };
    mockFind.mockResolvedValue({ docs: [row] });
    const fixture = createFixtureContentReader([row]);
    expect(await payloadContentReader.read(ownDefinition)).toEqual(await fixture.read(ownDefinition));
    expect(await fixture.read(definition)).toEqual({ status: "missing" });
  });

  it("reports missing or draft-only content without inventing content", async () => {
    mockFind.mockResolvedValue({ docs: [] });
    expect(await payloadContentReader.read(definition)).toEqual({ status: "missing" });
    const fixture = createFixtureContentReader([{ ...document, status: "draft" }]);
    expect(await fixture.read(definition)).toEqual({ status: "missing" });
  });

  it("rejects invalid identifiers before touching Payload", async () => {
    expect(await payloadContentReader.read({ ...definition, key: "../invalid" }))
      .toEqual({ status: "error", reason: "invalid-key" });
    expect(mockGetPayload).not.toHaveBeenCalled();
  });

  it.each([
    { heading: "" },
    { heading: "synthetic", statistics: [{ number: "NaN", description: "synthetic" }] },
  ])("reports invalid CMS content: %j", async (row) => {
    mockFind.mockResolvedValue({ docs: [row] });
    expect(await payloadContentReader.read(definition)).toEqual({ status: "error", reason: "invalid-content" });
    expect(await createFixtureContentReader([{ ...row, key: definition.key, status: "published" }]).read(definition))
      .toEqual({ status: "error", reason: "invalid-content" });
  });

  it("hides infrastructure errors and never substitutes fixtures", async () => {
    mockFind.mockRejectedValue(new Error("postgres://secret-credentials"));
    expect(await payloadContentReader.read(definition)).toEqual({ status: "error", reason: "unavailable" });
  });

  it("queries again after an editor saves; content is not cached across reads", async () => {
    mockFind.mockResolvedValueOnce({ docs: [document] })
      .mockResolvedValueOnce({ docs: [{ ...document, heading: "Edited locally" }] });
    expect(await payloadContentReader.read(definition)).toMatchObject({ content: { heading: document.heading } });
    expect(await payloadContentReader.read(definition)).toMatchObject({ content: { heading: "Edited locally" } });
    expect(mockFind).toHaveBeenCalledTimes(2);
  });
});
