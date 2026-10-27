// SDK-free metadata shared by discovery and the provider allowlist.
// Register a flag here once; definitions.ts supplies its runtime evaluator.
export const flagCatalog = {
  "CMS-Access": {
    description: "Access to the UTMIST CMS controls",
    origin: "https://vercel.com/utmist-infrastructure/client/flag/CMS-Access",
    defaultValue: false,
    options: [
      { value: false, label: "Off" },
      { value: true, label: "On" },
    ],
  },
};
