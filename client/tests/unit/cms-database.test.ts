import { payloadDatabaseOptions } from "@/cms/database";

describe("Payload database schema changes", () => {
  it.each([
    "db.example.supabase.co",
    "aws-0-us-east-2.pooler.supabase.com",
  ])("verifies Supabase TLS for %s even if the URI disables it", (host) => {
    const options = payloadDatabaseOptions(`postgresql://payload:example@${host}:5432/postgres?sslmode=no-verify&ssl=0&sslrootcert=missing&application_name=cms`);
    expect(options.pool?.ssl).toEqual({
      ca: expect.stringContaining("-----BEGIN CERTIFICATE-----"),
      rejectUnauthorized: true,
    });
    const uri = new URL(options.pool!.connectionString!);
    expect([...uri.searchParams.keys()]).toEqual(["application_name"]);
  });

  it("does not install Supabase's CA for unrelated hosts", () => {
    expect(payloadDatabaseOptions("postgresql://payload:local@localhost:5432/cms").pool?.ssl).toBeUndefined();
    expect(payloadDatabaseOptions("postgresql://payload:local@db.supabase.co.example.com/cms").pool?.ssl).toBeUndefined();
  });

  it.each(["localhost", "127.0.0.1", "[::1]"])("allows local development schema push on %s", (host) => {
    expect(payloadDatabaseOptions(`postgresql://payload:local@${host}:5432/utmist_payload`, {
      NODE_ENV: "development",
    }).push).toBe(true);
  });

  it.each([
    "postgresql://payload:example@db.example.supabase.co:5432/postgres",
    "postgresql://payload:example@aws-0-us-east-2.pooler.supabase.com:5432/postgres",
    "postgresql://payload:example@localhost.example.com:5432/postgres",
    "postgresql://payload:example@127.0.0.1:5432/postgres?host=db.example.supabase.co",
    "https://localhost/postgres",
    "",
    "invalid",
  ])("requires explicit migrations for %s even during development", (uri) => {
    expect(payloadDatabaseOptions(uri, { NODE_ENV: "development" }).push).toBe(false);
  });

  it.each([
    { NODE_ENV: "production" },
    { NODE_ENV: "test" },
    { NODE_ENV: "development", VERCEL: "1" },
    { NODE_ENV: "development", VERCEL_ENV: "preview" },
    {},
  ])("never pushes a schema in a build, test, or deployment: %j", (environment) => {
    expect(payloadDatabaseOptions("postgresql://payload:local@localhost:5432/utmist_payload", environment).push).toBe(false);
  });
});
