// SDK-free metadata shared by discovery and the provider allowlist.
// Register a flag here once; definitions.ts supplies its runtime evaluator.
export const flagCatalog = {
  "Web-Redesign": {
    description: "Show the redesigned homepage and shared website navigation",
    origin: "https://vercel.com/utmist-infrastructure/client/flag/Web-Redesign",
    defaultValue: false,
    options: [
      { value: false, label: "Current website" },
      { value: true, label: "Website redesign" },
    ],
  },
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
