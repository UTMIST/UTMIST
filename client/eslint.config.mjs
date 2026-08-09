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

export default eslintConfig;
