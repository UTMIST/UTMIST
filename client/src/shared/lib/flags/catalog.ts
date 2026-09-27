// SDK-free metadata shared by discovery and the provider allowlist.
// Register a flag here once; definitions.ts supplies its runtime evaluator.
export const flagCatalog = {
  "Eigen-AI-Redesign": {
    description: "Toggle the new 2026 EigenAI Website",
    origin: "https://vercel.com/utmist-infrastructure/client/flag/Eigen-AI-Redesign",
    defaultValue: false,
    options: [
      { value: false, label: "Off" },
      { value: true, label: "On" },
    ],
  },
};
