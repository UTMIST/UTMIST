import {
  PUBLIC_SEED_SOURCES,
  seedSourceData,
} from "@/cms/seed-data";
import {
  seedPublicContent,
  slugify,
  type SeedPayload,
} from "@/cms/seed-public-content";

type StoredRecord = {
  collection: string;
  data: Record<string, unknown>;
};

const createFakePayload = () => {
  const records: StoredRecord[] = [];
  let settings: Record<string, unknown> = {};

  const payload: SeedPayload = {
    async create({ collection, data }) {
      records.push({ collection, data });
      return { id: records.length };
    },
    async find({ collection, where }) {
      const [field, condition] = Object.entries(where)[0];
      const match = records.find(
        (record) =>
          record.collection === collection &&
          record.data[field] === condition.equals,
      );
      return { docs: match ? [{ id: records.indexOf(match) + 1 }] : [] };
    },
    async findGlobal() {
      return settings;
    },
    async updateGlobal({ data }) {
      settings = data;
      return data;
    },
  };

  return { payload, records, getSettings: () => settings };
};

describe("Payload public content seed", () => {
  it("uses only public sources and includes careers and events", () => {
    expect(PUBLIC_SEED_SOURCES).toContain("src/assets/careers.json");
    expect(PUBLIC_SEED_SOURCES).toContain(
      "src/features/events/api/events.ts",
    );
    expect(PUBLIC_SEED_SOURCES.join(" ")).not.toContain("applicants");
    expect(seedSourceData.careers.length).toBeGreaterThan(0);
    expect(seedSourceData.events.length).toBeGreaterThan(0);
  });

  it("creates current public content once without overwriting it", async () => {
    const fake = createFakePayload();

    const first = await seedPublicContent(fake.payload);
    const firstRecords = [...fake.records];
    const second = await seedPublicContent(fake.payload);

    expect(first.created).toBeGreaterThan(100);
    expect(second.created).toBe(0);
    expect(second.skipped).toBe(first.created);
    expect(fake.records).toEqual(firstRecords);
    expect(fake.records.some(({ collection }) => collection === "careers")).toBe(
      true,
    );
    expect(fake.records.some(({ collection }) => collection === "events")).toBe(
      true,
    );
    const eventResources = fake.records
      .filter(({ collection }) => collection === "events")
      .flatMap(({ data }) =>
        Array.isArray(data.resources) ? data.resources : [],
      );
    expect(eventResources).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ url: "N/A" })]),
    );
    expect(fake.records.some(({ collection }) => collection === "applicants")).toBe(
      false,
    );
    expect(fake.getSettings()).toMatchObject({
      contactEmail: "utorontomist@gmail.com",
      _status: "published",
    });
  });

  it("creates stable kebab-case identifiers", () => {
    expect(slugify("AI Squared & ML: Research!")).toBe(
      "ai-squared-ml-research",
    );
  });
});
