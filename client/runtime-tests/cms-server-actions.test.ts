// Runs against the real Next production build, without mocking Payload's layout.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes, webcrypto } from "node:crypto";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { encryptOverrides } from "flags";

type ActionManifest = {
  encryptionKey: string;
  node: Record<string, { filename?: string }>;
};

test("Payload's built-in language action obeys CMS off → on → off", { timeout: 30_000 }, async (t) => {
  const clientDir = fileURLToPath(new URL("../", import.meta.url));
  const manifest: ActionManifest = JSON.parse(await readFile(
    new URL("../.next/server/server-reference-manifest.json", import.meta.url), "utf8",
  ));
  const actions = Object.entries(manifest.node).filter(([, entry]) =>
    entry.filename?.endsWith("@payloadcms/next/dist/layouts/Root/index.js"),
  );
  assert.equal(actions.length, 1, "Expected Payload's built-in switchLanguageServerAction in the build");
  const [actionId] = actions[0];

  // Next encrypts the captured cookiePrefix as a Flight-serialized closure.
  // Read the current build's key/ID; never hardcode an action ID or log its key.
  // The enabled control below must execute the real action and set its cookie,
  // so changes to this internal wire format cannot make denial checks pass silently.
  const iv = randomBytes(16);
  const key = await webcrypto.subtle.importKey(
    "raw", Buffer.from(manifest.encryptionKey, "base64"), "AES-GCM", false, ["encrypt"],
  );
  const encrypted = await webcrypto.subtle.encrypt(
    { name: "AES-GCM", iv }, key, new TextEncoder().encode(`${actionId}0:["payload"]\n`),
  );
  const boundArgs = Buffer.concat([iv, Buffer.from(encrypted)]).toString("base64");

  const listener = createServer();
  listener.listen(0, "127.0.0.1");
  await once(listener, "listening");
  const address = listener.address();
  assert(address && typeof address !== "string");
  const port = address.port;
  await new Promise<void>((resolve, reject) => listener.close((error) => error ? reject(error) : resolve()));
  const origin = `http://127.0.0.1:${port}`;
  const secret = randomBytes(32).toString("base64url");
  const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: clientDir,
    env: {
      ...process.env,
      NODE_ENV: "production",
      FLAGS: "", FLAGS_SECRET: secret,
      VERCEL: "", VERCEL_ENV: "", VERCEL_OIDC_TOKEN: "",
      NEXT_PUBLIC_SUPABASE_URL: "https://synthetic.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic-anon-key",
      PAYLOAD_SECRET: "synthetic-runtime-test-secret",
      PAYLOAD_DATABASE_URI: "postgresql://synthetic:synthetic@127.0.0.1:1/unreachable",
      NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: manifest.encryptionKey,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  server.stdout.on("data", (chunk: Buffer) => { logs = (logs + chunk.toString()).slice(-4000); });
  server.stderr.on("data", (chunk: Buffer) => { logs = (logs + chunk.toString()).slice(-4000); });
  t.after(async () => {
    if (server.exitCode !== null || server.signalCode !== null) return;
    const exited = once(server, "exit");
    const forceStop = setTimeout(() => server.kill("SIGKILL"), 5000);
    server.kill("SIGTERM");
    try { await exited; } finally { clearTimeout(forceStop); }
  });

  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    assert.equal(server.exitCode, null, `Next exited before startup: ${logs}`);
    try {
      const response = await fetch(`${origin}/cms`, { signal: AbortSignal.timeout(500) });
      await response.text();
      if (response.status === 404) { ready = true; break; }
    } catch { /* Retry while the server starts. */ }
    await delay(100);
  }
  assert(ready, `Next did not serve the disabled CMS 404: ${logs}`);

  for (const [index, enabled] of [false, true, false].entries()) {
    await t.test(`${index + 1}: CMS ${enabled ? "on executes" : "off rejects"} the real action`, async () => {
      const override = await encryptOverrides({ "CMS-Access": enabled }, secret);
      const response = await fetch(`${origin}/cms`, {
        method: "POST",
        headers: {
          "Next-Action": actionId,
          "Content-Type": "text/plain;charset=UTF-8",
          Origin: origin,
          Cookie: `payload-token=synthetic-existing-editor-session; payload-lng=en; vercel-flag-overrides=${override}`,
          // Exercise action dispatch without rendering the database-backed editor,
          // just as Next does when forwarding an action between route workers.
          "x-action-forwarded": "1",
        },
        body: JSON.stringify([boundArgs, "fr"]),
        signal: AbortSignal.timeout(5000),
      });
      const body = await response.text();
      const cookies = response.headers.getSetCookie();
      if (enabled) {
        assert.equal(response.status, 200, `Enabled action failed: ${body}\n${logs}`);
        assert(cookies.some((cookie) => cookie.startsWith("payload-lng=fr;")), "The real language action must run in the enabled control");
      } else {
        assert.equal(response.status, 404);
        assert.equal(response.headers.get("Cache-Control"), "no-store");
        assert.deepEqual(JSON.parse(body), { error: "Not Found" });
        assert(!cookies.some((cookie) => cookie.startsWith("payload-lng=")), "Disabled actions must not mutate Payload's language cookie");
      }
    });
  }

  await t.test("disabled form POSTs without a Next-Action header are also rejected", async () => {
    const form = new FormData();
    form.set(`$ACTION_ID_${actionId}`, "");
    const response = await fetch(`${origin}/cms/login`, {
      method: "POST", body: form, signal: AbortSignal.timeout(5000),
    });
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(await response.json(), { error: "Not Found" });
    assert(!response.headers.getSetCookie().some((cookie) => cookie.startsWith("payload-lng=")));
  });
});
