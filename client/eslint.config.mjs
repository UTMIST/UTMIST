// eslint-config-next 16 ships native flat config, so these are imported and
// spread directly. The previous FlatCompat shim only existed to consume the
// old eslintrc-style presets and now throws on them.
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
// internals. Shared may never import features. docs/superpowers/specs/
// 2026-08-13-zone-ownership-repo-prep-design.md is the source of truth.
const ZONE_FEATURES = ["public-site", "recruitment", "careers", "events", "members"];

const SHARED_BARRELS_ONLY = {
  group: [
    "@/shared/ui/*",
    "@/shared/lib/*",
    "!@/shared/lib/client",
    "!@/shared/lib/server",
  ],
  message:
    "Import the barrels (@/shared/ui, @/shared/lib, @/shared/lib/client, @/shared/lib/server), not shared internals.",
};

const zoneBoundaryRules = ZONE_FEATURES.map((feature) => ({
  files: [`src/features/${feature}/**`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ZONE_FEATURES.filter((f) => f !== feature).flatMap((f) => [
              `@/features/${f}`,
              `@/features/${f}/*`,
            ]),
            message:
              "Features may not import other features. Promote genuinely shared code to @/shared (platform/design-system owners review it).",
          },
          SHARED_BARRELS_ONLY,
        ],
      },
    ],
  },
}));

const sharedBoundaryRule = {
  files: ["src/shared/**"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/features/*"],
            message: "Shared code may never depend on features.",
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
    "no-restricted-imports": ["error", { patterns: [SHARED_BARRELS_ONLY] }],
  },
};

eslintConfig.push(...zoneBoundaryRules, sharedBoundaryRule, appBarrelRule);

export default eslintConfig;
