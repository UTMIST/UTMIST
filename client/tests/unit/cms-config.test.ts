import { PayloadUsers } from "@/cms/collections/PayloadUsers";
import { Proofs } from "@/cms/collections/Proofs";
import { PAYLOAD_DATABASE_SCHEMA, PAYLOAD_ROUTES } from "@/cms/config";

describe("Payload CMS foundation", () => {
  it("keeps the CMS database and routes isolated from existing app surfaces", () => {
    expect(PAYLOAD_DATABASE_SCHEMA).toBe("payload");
    expect(PAYLOAD_ROUTES).toEqual({
      admin: "/cms",
      api: "/cms-api",
      graphQL: "/cms-graphql",
      graphQLPlayground: "/cms-graphql-playground",
    });
  });

  it("uses a dedicated authenticated collection for Payload editors", () => {
    expect(PayloadUsers.slug).toBe("cms-users");
    expect(PayloadUsers.auth).toBe(true);
    expect(PayloadUsers.admin?.useAsTitle).toBe("email");
  });

  it("defines the editable proof content contract", () => {
    expect(Proofs.slug).toBe("proofs");
    expect(Proofs.admin?.useAsTitle).toBe("title");
    expect(Proofs.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "title", type: "text", required: true }),
        expect.objectContaining({
          name: "message",
          type: "textarea",
          required: true,
        }),
        expect.objectContaining({
          name: "status",
          type: "select",
          required: true,
        }),
      ]),
    );
  });
});
