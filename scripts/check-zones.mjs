#!/usr/bin/env node
/**
 * Zone consistency checker.
 *
 * The zone -> path/name mapping is hand-maintained in several places. This
 * script cross-checks them so a zone added (or renamed) in one place but not
 * the others fails CI instead of failing silently.
 *
 * Canonical source: the `zone: <name>` label keys in .github/labeler.yml.
 * Checked against:
 *   - .github/ISSUE_TEMPLATE/task.yml  (Zone dropdown options)
 *   - .github/workflows/zone-label-issues.yml  (the `zones` array)
 *   - docs/ZONES.md  (every zone has a section / mention)
 *   - client/src/features/*  (every feature dir is documented in ZONES.md)
 *
 * Usage: node scripts/check-zones.mjs [repo-root]
 * (repo-root defaults to the parent of this script's directory; the override
 * exists for testing against a doctored copy of the tree.)
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(
  process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), ".."),
);

const FILES = {
  labeler: ".github/labeler.yml",
  task: ".github/ISSUE_TEMPLATE/task.yml",
  issueWorkflow: ".github/workflows/zone-label-issues.yml",
  zonesDoc: "docs/ZONES.md",
};
const FEATURES_DIR = "client/src/features";

const errors = [];
const fail = (msg) => errors.push(msg);

function readOrDie(relPath) {
  const abs = join(ROOT, relPath);
  try {
    return readFileSync(abs, "utf8");
  } catch {
    console.error(`FAIL: cannot read ${relPath} (looked in ${ROOT})`);
    process.exit(1);
  }
}

// Lowercase and strip everything but [a-z0-9] so "DevEx / CI-CD" can match
// "devex" and "Design system" can match "design-system".
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// ---------------------------------------------------------------------------
// a. Canonical zones: top-level `"zone: <name>":` keys in labeler.yml
// ---------------------------------------------------------------------------
const labelerSrc = readOrDie(FILES.labeler);
const canonical = [];
for (const line of labelerSrc.split("\n")) {
  // Top-level key, optionally quoted: "zone: design-system":  /  zone: x:
  const m = line.match(/^\s*['"]?zone:\s*([A-Za-z0-9._-]+)['"]?\s*:/);
  if (m) canonical.push(m[1]);
}
if (canonical.length === 0) {
  console.error(
    `FAIL: found no 'zone: <name>' label keys in ${FILES.labeler} — ` +
      `cannot derive the canonical zone set. Has the file's shape changed?`,
  );
  process.exit(1);
}
const canonicalSet = new Set(canonical);
if (canonicalSet.size !== canonical.length) {
  fail(`${FILES.labeler}: duplicate zone label keys detected`);
}

// ---------------------------------------------------------------------------
// b. task.yml Zone dropdown covers exactly the canonical zones (+ escape)
// ---------------------------------------------------------------------------
const taskSrc = readOrDie(FILES.task);
{
  const lines = taskSrc.split("\n");
  // Find the dropdown whose id is `zone` (fall back to `label: Zone`), then
  // collect the `- item` entries of the following `options:` block.
  let anchor = lines.findIndex((l) => /^\s*id:\s*zone\s*$/.test(l));
  if (anchor === -1) {
    anchor = lines.findIndex((l) => /^\s*label:\s*['"]?Zone['"]?\s*$/.test(l));
  }
  if (anchor === -1) {
    fail(`${FILES.task}: could not find the Zone dropdown (no 'id: zone')`);
  } else {
    let optIdx = -1;
    for (let i = anchor; i < lines.length; i++) {
      if (/^\s*options:\s*$/.test(lines[i])) {
        optIdx = i;
        break;
      }
    }
    if (optIdx === -1) {
      fail(`${FILES.task}: Zone dropdown has no 'options:' block`);
    } else {
      const optIndent = lines[optIdx].match(/^\s*/)[0].length;
      const options = [];
      for (let i = optIdx + 1; i < lines.length; i++) {
        const line = lines[i];
        if (/^\s*$/.test(line) || /^\s*#/.test(line)) continue;
        const indent = line.match(/^\s*/)[0].length;
        if (indent <= optIndent) break; // dedent -> end of options block
        const m = line.match(/^\s*-\s*['"]?(.+?)['"]?\s*$/);
        if (!m) break; // not a list item -> end of options block
        options.push(m[1]);
      }
      if (options.length === 0) {
        fail(`${FILES.task}: Zone dropdown 'options:' block is empty`);
      }
      const escapeRe = /not\s*sure|unsure|other|unknown|don'?t\s*know/i;
      const escapes = options.filter(
        (o) => !canonicalSet.has(o) && escapeRe.test(o),
      );
      const extras = options.filter(
        (o) => !canonicalSet.has(o) && !escapeRe.test(o),
      );
      for (const zone of canonical) {
        if (!options.includes(zone)) {
          fail(
            `zone '${zone}' is in ${FILES.labeler} but missing from the ` +
              `Zone dropdown in ${FILES.task}`,
          );
        }
      }
      for (const extra of extras) {
        fail(
          `Zone dropdown option '${extra}' in ${FILES.task} is not a zone ` +
            `in ${FILES.labeler} (and doesn't look like an escape option)`,
        );
      }
      if (escapes.length === 0) {
        fail(
          `${FILES.task}: Zone dropdown has no 'not sure'-style escape option`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// c. zones array in zone-label-issues.yml equals the canonical set
// ---------------------------------------------------------------------------
const wfSrc = readOrDie(FILES.issueWorkflow);
{
  // Tolerant of the array being rebuilt/reformatted, as long as there is a
  // `zones = [ ... ]` (or `zones: [ ... ]`) literal of quoted strings.
  const m = wfSrc.match(/\bzones\s*[=:]\s*\[([\s\S]*?)\]/);
  if (!m) {
    fail(
      `${FILES.issueWorkflow}: could not find a 'zones = [...]' array — ` +
        `has the workflow's shape changed?`,
    );
  } else {
    const wfZones = [...m[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map(
      (x) => x[1],
    );
    if (wfZones.length === 0) {
      fail(`${FILES.issueWorkflow}: the zones array contains no strings`);
    }
    for (const zone of canonical) {
      if (!wfZones.includes(zone)) {
        fail(
          `zone '${zone}' is in ${FILES.labeler} but missing from the ` +
            `zones array in ${FILES.issueWorkflow}`,
        );
      }
    }
    for (const zone of wfZones) {
      if (!canonicalSet.has(zone)) {
        fail(
          `zone '${zone}' is in the zones array in ${FILES.issueWorkflow} ` +
            `but has no 'zone: ${zone}' label in ${FILES.labeler}`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// d. every zone is mentioned in docs/ZONES.md
// ---------------------------------------------------------------------------
const docSrc = readOrDie(FILES.zonesDoc);
{
  // Zone sections are markdown headings ("### Design system", "### DevEx /
  // CI-CD"); match by normalized text so slug vs. display name both work.
  const headings = [...docSrc.matchAll(/^#{1,6}\s+(.+)$/gm)].map((m) =>
    normalize(m[1]),
  );
  const normalizedDoc = normalize(docSrc);
  for (const zone of canonical) {
    const nz = normalize(zone);
    const inHeading = headings.some((h) => h.includes(nz));
    if (!inHeading && !normalizedDoc.includes(nz)) {
      fail(
        `zone '${zone}' is in ${FILES.labeler} but not mentioned in ` +
          `${FILES.zonesDoc}`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// e. every client/src/features/* dir is documented in docs/ZONES.md
// ---------------------------------------------------------------------------
{
  const absFeatures = join(ROOT, FEATURES_DIR);
  if (!existsSync(absFeatures)) {
    fail(`${FEATURES_DIR}/ does not exist — cannot check feature dirs`);
  } else {
    const featureDirs = readdirSync(absFeatures, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const dir of featureDirs) {
      // ZONES.md tabulates each feature module as a `client/src/features/<dir>/`
      // path in its zone's path list.
      if (!docSrc.includes(`features/${dir}`)) {
        fail(
          `feature directory ${FEATURES_DIR}/${dir}/ is not mentioned in ` +
            `${FILES.zonesDoc} (expected a 'client/src/features/${dir}/' path ` +
            `under some zone)`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
if (errors.length > 0) {
  console.error("Zone consistency check FAILED:\n");
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    "\nThe zone mapping is hand-maintained in .github/labeler.yml, " +
      ".github/CODEOWNERS, docs/ZONES.md, .github/ISSUE_TEMPLATE/task.yml, " +
      ".github/workflows/zone-label-issues.yml, and client/eslint.config.mjs " +
      "— keep them in sync (labeler.yml is canonical).",
  );
  process.exit(1);
}

console.log(`Zone consistency check passed. Zones (${canonical.length}):`);
for (const zone of canonical) console.log(`  - ${zone}`);
