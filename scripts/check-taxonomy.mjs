#!/usr/bin/env node
/**
 * Taxonomy consistency checker.
 *
 * This repo runs TWO deliberately independent taxonomies:
 *
 *   zones — classify PULL REQUESTS by the code they touch. Canonical list:
 *           the `zone: <name>` label keys in .github/labeler.yml. Derived from
 *           changed paths; drives CODEOWNERS review routing.
 *   areas — classify ISSUES by the kind of work they need. Canonical list:
 *           the Area dropdown in .github/ISSUE_TEMPLATE/task.yml. Declared by
 *           the filer; never derived from paths.
 *
 * They are not 1:1 and must not leak into each other. Each list is repeated in
 * several hand-maintained files, so this script cross-checks them — and checks
 * that neither taxonomy has crept into the other's files — so drift fails CI
 * instead of failing silently.
 *
 * Usage: node scripts/check-taxonomy.mjs [repo-root]
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
  areaWorkflow: ".github/workflows/area-label-issues.yml",
  zonesDoc: "docs/ZONES.md",
  areasDoc: "docs/AREAS.md",
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

const ESCAPE_RE = /not\s*sure|unsure|other|unknown|don'?t\s*know/i;

/** Pull the `- item` entries out of the options block of one issue-form dropdown. */
function dropdownOptions(src, file, id, label) {
  const lines = src.split("\n");
  let anchor = lines.findIndex((l) => new RegExp(`^\\s*id:\\s*${id}\\s*$`).test(l));
  if (anchor === -1) {
    anchor = lines.findIndex((l) =>
      new RegExp(`^\\s*label:\\s*['"]?${label}['"]?\\s*$`).test(l),
    );
  }
  if (anchor === -1) {
    fail(`${file}: could not find the ${label} dropdown (no 'id: ${id}')`);
    return null;
  }
  let optIdx = -1;
  for (let i = anchor; i < lines.length; i++) {
    if (/^\s*options:\s*$/.test(lines[i])) {
      optIdx = i;
      break;
    }
  }
  if (optIdx === -1) {
    fail(`${file}: ${label} dropdown has no 'options:' block`);
    return null;
  }
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
    fail(`${file}: ${label} dropdown 'options:' block is empty`);
    return null;
  }
  return options;
}

/** Pull the string literals out of a `const <name> = [ ... ]` array. */
function arrayLiteral(src, file, name) {
  const m = src.match(new RegExp(`\\b${name}\\s*[=:]\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) {
    fail(`${file}: could not find a '${name} = [...]' array — has the file's shape changed?`);
    return null;
  }
  const items = [...m[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((x) => x[1]);
  if (items.length === 0) {
    fail(`${file}: the ${name} array contains no strings`);
    return null;
  }
  return items;
}

/** Every name in `list` is mentioned in `doc` (as a heading, or anywhere). */
function checkDocumented(list, docSrc, docFile, labelerFile) {
  const headings = [...docSrc.matchAll(/^#{1,6}\s+(.+)$/gm)].map((m) => normalize(m[1]));
  const normalizedDoc = normalize(docSrc);
  for (const name of list) {
    const n = normalize(name);
    if (!headings.some((h) => h.includes(n)) && !normalizedDoc.includes(n)) {
      fail(`'${name}' is in ${labelerFile} but not mentioned in ${docFile}`);
    }
  }
}

// ===========================================================================
// ZONES — canonical: top-level `"zone: <name>":` keys in labeler.yml
// ===========================================================================
const labelerSrc = readOrDie(FILES.labeler);
const zones = [];
for (const line of labelerSrc.split("\n")) {
  // Top-level key, optionally quoted: "zone: design-system":  /  zone: x:
  const m = line.match(/^\s*['"]?zone:\s*([A-Za-z0-9._-]+)['"]?\s*:/);
  if (m) zones.push(m[1]);
}
if (zones.length === 0) {
  console.error(
    `FAIL: found no 'zone: <name>' label keys in ${FILES.labeler} — ` +
      `cannot derive the canonical zone set. Has the file's shape changed?`,
  );
  process.exit(1);
}
const zoneSet = new Set(zones);
if (zoneSet.size !== zones.length) {
  fail(`${FILES.labeler}: duplicate zone label keys detected`);
}

// a. every zone is documented
const zonesDocSrc = readOrDie(FILES.zonesDoc);
checkDocumented(zones, zonesDocSrc, FILES.zonesDoc, FILES.labeler);

// b. every client/src/features/* dir is documented in ZONES.md
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
      if (!zonesDocSrc.includes(`features/${dir}`)) {
        fail(
          `feature directory ${FEATURES_DIR}/${dir}/ is not mentioned in ` +
            `${FILES.zonesDoc} (expected a 'client/src/features/${dir}/' path ` +
            `under some zone)`,
        );
      }
    }
  }
}

// ===========================================================================
// AREAS — canonical: the Area dropdown in the task template
// ===========================================================================
const taskSrc = readOrDie(FILES.task);
const areaOptions = dropdownOptions(taskSrc, FILES.task, "area", "Area");
let areas = [];
if (areaOptions) {
  areas = areaOptions.filter((o) => !ESCAPE_RE.test(o));
  if (areas.length === 0) {
    fail(`${FILES.task}: the Area dropdown has no real options, only escapes`);
  }
  if (areaOptions.length === areas.length) {
    fail(`${FILES.task}: Area dropdown has no 'not sure'-style escape option`);
  }

  // c. the areas array in the labeling workflow matches exactly
  const wfSrc = readOrDie(FILES.areaWorkflow);
  const wfAreas = arrayLiteral(wfSrc, FILES.areaWorkflow, "areas");
  if (wfAreas) {
    for (const area of areas) {
      if (!wfAreas.includes(area)) {
        fail(
          `area '${area}' is in the Area dropdown in ${FILES.task} but missing ` +
            `from the areas array in ${FILES.areaWorkflow}`,
        );
      }
    }
    for (const area of wfAreas) {
      if (!areas.includes(area)) {
        fail(
          `area '${area}' is in the areas array in ${FILES.areaWorkflow} but is ` +
            `not an option in the Area dropdown in ${FILES.task}`,
        );
      }
    }
  }

  // d. every area is documented
  checkDocumented(areas, readOrDie(FILES.areasDoc), FILES.areasDoc, FILES.task);
}

// ===========================================================================
// CROSSOVER — the two taxonomies must stay apart
// ===========================================================================
// Zones are derived from changed paths, so a zone in the issue form means
// someone is asking filers to guess at code layout. Areas are declared, so an
// area in labeler.yml means someone is trying to derive one from paths.
{
  // Probe directly rather than via dropdownOptions() — here a MISSING Zone
  // dropdown is the passing case, and that helper reports absence as an error.
  if (/^\s*id:\s*zone\s*$/m.test(taskSrc) || /^\s*label:\s*['"]?Zone['"]?\s*$/m.test(taskSrc)) {
    fail(
      `${FILES.task} still has a Zone dropdown. Zones are derived from a PR's ` +
        `changed paths and are never set on an issue — see docs/AREAS.md.`,
    );
  }
  for (const area of areas) {
    if (new RegExp(`^\\s*['"]?(zone|area):\\s*${area}['"]?\\s*:`, "m").test(labelerSrc)) {
      fail(
        `area '${area}' has a label key in ${FILES.labeler}. Areas are declared ` +
          `on issues, never derived from changed paths.`,
      );
    }
  }
  for (const zone of zones) {
    if (areas.includes(zone)) {
      fail(
        `'${zone}' is both a zone and an area. The two taxonomies are meant to ` +
          `be independent; a shared name defeats that.`,
      );
    }
  }
}

// ===========================================================================
// Report
// ===========================================================================
if (errors.length > 0) {
  console.error("Taxonomy consistency check FAILED:\n");
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    "\nZones are hand-maintained in .github/labeler.yml, .github/CODEOWNERS, " +
      "docs/ZONES.md, and client/eslint.config.mjs. Areas are hand-maintained " +
      "in .github/ISSUE_TEMPLATE/task.yml, " +
      ".github/workflows/area-label-issues.yml, and docs/AREAS.md. Keep each " +
      "list in sync with itself, and keep the two apart.",
  );
  process.exit(1);
}

console.log(`Taxonomy consistency check passed.`);
console.log(`  zones (${zones.length}, PRs by code touched): ${zones.join(", ")}`);
console.log(`  areas (${areas.length}, issues by kind of work): ${areas.join(", ")}`);
