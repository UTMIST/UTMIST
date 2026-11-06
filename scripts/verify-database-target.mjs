import assert from "node:assert/strict";

// Target identities are public configuration; credentials stay in scoped secrets.
const targets = { ci: "lrbvknlviodxhhuautfi", production: "gqqgsvhzonratwkmjiji" };
const placeholders = {
  NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-anon-key",
  PAYLOAD_DATABASE_URI: "postgresql://payload:payload@127.0.0.1:5432/payload",
  PAYLOAD_SECRET: "ci-only-payload-secret",
};

try {
  const mode = process.argv[2];
  assert.ok(Object.hasOwn(targets, mode));
  if (mode === "ci" && Object.entries(placeholders).every(([key, value]) => process.env[key] === value)) {
    console.log("Database target verified: secretless CI placeholders.");
  } else {
    const ref = targets[mode];
    assert.equal(process.env.NEXT_PUBLIC_SUPABASE_URL, `https://${ref}.supabase.co`);
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    // This deployment uses the legacy anonymous key. This check reads its
    // project claim; it does not verify the signature or replace live tests.
    assert.equal(key?.split(".").length, 3);
    const claims = JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString());
    assert.equal(claims.ref, ref);
    assert.equal(claims.role, "anon");
    const database = new URL(process.env.PAYLOAD_DATABASE_URI);
    assert.ok(["postgres:", "postgresql:"].includes(database.protocol));
    assert.equal(database.hostname, "aws-0-us-east-2.pooler.supabase.com");
    assert.equal(database.port, "5432");
    assert.equal(database.username, `utmist_payload.${ref}`);
    assert.equal(database.pathname, "/postgres");
    assert.ok(database.password);
    const options = [...database.searchParams];
    assert.ok(options.length <= 1);
    assert.ok(options.every(([key, value]) => key === "sslmode" && ["require", "verify-full"].includes(value)));
    assert.equal(database.hash, "");
    assert.ok(process.env.PAYLOAD_SECRET?.length >= 32);
    console.log(`Database target verified: ${mode === "ci" ? "testing" : "production"}.`);
  }
} catch {
  // URL/parser/assertion errors can contain credentials. Never print them.
  console.error("Database target validation failed: check scoped Supabase and Payload settings.");
  process.exitCode = 1;
}
