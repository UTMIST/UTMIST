import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const command = fileURLToPath(new URL("./verify-database-target.mjs", import.meta.url));
const production = "gqqgsvhzonratwkmjiji";
const testing = "lrbvknlviodxhhuautfi";
const password = "fixture-password-must-not-be-logged";
const jwt = (ref) => `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ ref, role: "anon" })).toString("base64url")}.fixture`;
const credentials = (ref) => ({
  NEXT_PUBLIC_SUPABASE_URL: `https://${ref}.supabase.co`,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: jwt(ref),
  PAYLOAD_DATABASE_URI: `postgresql://utmist_payload.${ref}:${password}@aws-0-us-east-2.pooler.supabase.com:5432/postgres`,
  PAYLOAD_SECRET: "fixture-signing-secret-must-not-be-logged",
});
const placeholders = {
  NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-anon-key",
  PAYLOAD_DATABASE_URI: "postgresql://payload:payload@127.0.0.1:5432/payload",
  PAYLOAD_SECRET: "ci-only-payload-secret",
};

// These cases catch credentials crossing the deployment boundary, including
// connection-string query overrides and a key from the wrong Supabase project.
for (const [name, mode, env, exitCode] of [
  ["testing credentials work in CI", "ci", credentials(testing), 0],
  ["production credentials work only in production", "production", credentials(production), 0],
  ["existing production TLS mode is accepted", "production", { ...credentials(production), PAYLOAD_DATABASE_URI: credentials(production).PAYLOAD_DATABASE_URI + "?sslmode=require" }, 0],
  ["disabling TLS is rejected", "ci", { ...credentials(testing), PAYLOAD_DATABASE_URI: credentials(testing).PAYLOAD_DATABASE_URI + "?sslmode=disable" }, 1],
  ["duplicate URI options cannot hide an override", "ci", { ...credentials(testing), PAYLOAD_DATABASE_URI: credentials(testing).PAYLOAD_DATABASE_URI + "?sslmode=require&sslmode=disable" }, 1],
  ["CI rejects production credentials", "ci", credentials(production), 1],
  ["production rejects testing credentials", "production", credentials(testing), 1],
  ["CI rejects a production CMS URI with a testing API", "ci", { ...credentials(testing), PAYLOAD_DATABASE_URI: credentials(production).PAYLOAD_DATABASE_URI }, 1],
  ["CI rejects a production API key with a testing URL", "ci", { ...credentials(testing), NEXT_PUBLIC_SUPABASE_ANON_KEY: jwt(production) }, 1],
  ["URI query overrides cannot bypass target validation", "ci", { ...credentials(testing), PAYLOAD_DATABASE_URI: credentials(testing).PAYLOAD_DATABASE_URI + "?host=db.gqqgsvhzonratwkmjiji.supabase.co" }, 1],
  ["CMS credentials must use the scoped role", "ci", { ...credentials(testing), PAYLOAD_DATABASE_URI: credentials(testing).PAYLOAD_DATABASE_URI.replace("utmist_payload.", "postgres.") }, 1],
  ["a similarly named host is rejected", "ci", { ...credentials(testing), NEXT_PUBLIC_SUPABASE_URL: `https://${testing}.supabase.co.example.com` }, 1],
  ["missing CMS secrets fail closed", "ci", { ...credentials(testing), PAYLOAD_SECRET: "" }, 1],
  ["a secretless build can use the complete placeholder set", "ci", placeholders, 0],
  ["placeholder builds cannot mix in a real CMS URI", "ci", { ...placeholders, PAYLOAD_DATABASE_URI: credentials(production).PAYLOAD_DATABASE_URI }, 1],
  ["production cannot deploy placeholders", "production", placeholders, 1],
  ["unknown modes fail closed", "preview", credentials(testing), 1],
]) {
  test(name, () => {
    const result = spawnSync(process.execPath, [command, mode], {
      env: { ...process.env, ...env }, encoding: "utf8",
    });
    assert.equal(result.status, exitCode, result.stderr);
    assert.ok(!(result.stdout + result.stderr).includes(password));
    assert.ok(!(result.stdout + result.stderr).includes(env.PAYLOAD_SECRET || "DO_NOT_MATCH_EMPTY"));
  });
}
