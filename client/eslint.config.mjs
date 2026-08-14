// eslint-config-next 16 ships native flat config, so these are imported and
// spread directly. The previous FlatCompat shim only existed to consume the
// old eslintrc-style presets and now throws on them.
import fs from "node:fs";
import path from "node:path";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  // `next lint` used to skip build output implicitly. `eslint .` does not, so
  // the ignores have to be declared here.
  {
    ignores: [
      ".next/**",
      "out/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,

  // Jest config and setup are CommonJS Node files, not app code. The setup file
  // also defines a mock <img> stand-in for next/image, which is not a real
  // accessibility surface.
  {
    files: ["jest.config.js", "jest.setup.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "jsx-a11y/alt-text": "off",
    },
  },

  // react-hooks v7 (new in eslint-config-next 16) added these two rules. They
  // flag five pre-existing spots that predate this config. `set-state-in-effect`
  // is a false positive on the `mounted` hydration guard in theme-toggle.tsx,
  // which is the pattern next-themes documents; the others need a case-by-case
  // look. Kept visible as warnings rather than switched off, so the work stays
  // on the radar without blocking every PR on an unrelated refactor.
  // TODO: triage these, then raise back to "error".
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
    },
  },
];

// --- Zone boundaries (see docs/ZONES.md) -----------------------------------
// Features may import shared barrels, never other features and never shared
// internals. Shared may never import features. Nothing outside src/app may
// import the app route shells. docs/superpowers/specs/
// 2026-08-13-zone-ownership-repo-prep-design.md is the source of truth.
//
// Enforced with import/no-restricted-paths (bundled with eslint-config-next,
// which also wires up the TypeScript resolver for the `@/` alias) rather than
// no-restricted-imports: the latter matches the literal specifier string, so
// relative imports (`../recruitment/...`) sailed past every boundary. This
// rule matches the *resolved file path*, so alias and relative imports are
// enforced identically.
//
// src/middleware.ts is intentionally outside every zone block below: it
// deep-imports supabase middleware via a relative path to keep the heavy
// server barrel out of the edge bundle.
const CLIENT_ROOT = import.meta.dirname;

// Derived from the filesystem so a newly added src/features/<zone>/ directory
// is enforced by construction — no list to keep in sync.
const ZONE_FEATURES = fs
  .readdirSync(path.join(CLIENT_ROOT, "src/features"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

// The only files under src/shared that non-shared code may import. Paths are
// relative to `from: "./src/shared"` below. client.ts/storage.ts barrels may
// land slightly after this config — `except` is pure path matching, so
// permitting them before they exist is harmless.
const SHARED_BARREL_FILES = [
  "./ui/index.ts",
  "./ui/client.ts",
  "./lib/index.ts",
  "./lib/client.ts",
  "./lib/server.ts",
  "./lib/storage.ts",
];

const SHARED_BARRELS_MESSAGE =
  "Import the barrels (@/shared/ui, @/shared/ui/client, @/shared/lib, @/shared/lib/client, @/shared/lib/server, @/shared/lib/storage), not shared internals.";

// Per-feature isolation: a file in feature X may resolve into src/features/X
// (its own zone, alias or relative) but nowhere else under src/features.
const featureIsolationZones = ZONE_FEATURES.map((feature) => ({
  target: `./src/features/${feature}`,
  from: "./src/features",
  except: [`./${feature}`],
  message:
    "Features may not import other features. Promote genuinely shared code to @/shared (platform/design-system owners review it).",
}));

const featureBoundaryRule = {
  files: ["src/features/**"],
  rules: {
    "import/no-restricted-paths": [
      "error",
      {
        basePath: CLIENT_ROOT,
        zones: [
          ...featureIsolationZones,
          {
            target: "./src/features",
            from: "./src/shared",
            except: SHARED_BARREL_FILES,
            message: SHARED_BARRELS_MESSAGE,
          },
          {
            target: "./src/features",
            from: "./src/app",
            message:
              "Features may not import app route files. Route shells re-export feature pages, never the reverse.",
          },
        ],
      },
    ],
  },
};

const sharedBoundaryRule = {
  files: ["src/shared/**"],
  rules: {
    "import/no-restricted-paths": [
      "error",
      {
        basePath: CLIENT_ROOT,
        zones: [
          {
            target: "./src/shared",
            from: "./src/features",
            message: "Shared code may never depend on features.",
          },
          {
            target: "./src/shared",
            from: "./src/app",
            // globals.css is a stylesheet that happens to live in src/app, not
            // a route module — shared/ui/scrollToTop.tsx imports it today. The
            // module-boundary ban below is about code, so the stylesheet stays
            // importable.
            except: ["./globals.css"],
            message: "Shared code may never depend on app route files.",
          },
        ],
      },
    ],
  },
};

const appBarrelRule = {
  files: ["src/app/**"],
  ignores: ["src/app/api/**"],
  rules: {
    "import/no-restricted-paths": [
      "error",
      {
        basePath: CLIENT_ROOT,
        zones: [
          {
            target: "./src/app",
            from: "./src/shared",
            except: SHARED_BARREL_FILES,
            message: SHARED_BARRELS_MESSAGE,
          },
        ],
      },
    ],
  },
};

eslintConfig.push(featureBoundaryRule, sharedBoundaryRule, appBarrelRule);

export default eslintConfig;
