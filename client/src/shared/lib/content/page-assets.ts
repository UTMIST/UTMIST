export const defaultHomeSponsorAssetsBySource = {
  "src/assets/logos/amd.svg": "amd",
  "src/assets/logos/modal.png": "modal",
  "src/assets/logos/qualcomm.svg": "qualcomm",
  "src/assets/logos/vector.svg": "vector",
  "src/assets/logos/google-cloud.svg": "google-cloud",
  "src/assets/logos/cohere.webp": "cohere",
  "src/assets/logos/jarvis.webp": "jarvis",
  "src/assets/logos/rotman.webp": "rotman",
  "src/assets/logos/tenstorrent.webp": "tenstorrent",
  "src/assets/logos/aerocoustics-transparent.png": "aerocoustics-transparent",
  "src/assets/logos/wombo.svg": "wombo",
  "src/assets/logos/google.webp": "google",
  "src/assets/logos/pwc-transparent.png": "pwc-transparent",
  "src/assets/logos/rbc.webp": "rbc",
  "src/assets/logos/EdgeAI.webp": "edgeai",
  "src/assets/logos/cgi.webp": "cgi",
  "src/assets/logos/cpsif.svg": "cpsif",
  "src/assets/logos/engsoc.svg": "engsoc",
  "src/assets/logos/compsci.webp": "compsci",
} as const satisfies Record<string, string>;

export const sponsorAssetsBySource = {
  ...defaultHomeSponsorAssetsBySource,
  "src/assets/photos/ventures/frv-black-logo.png": "front-row-ventures",
  "src/assets/photos/ventures/forum-black-purple-logo.png": "forum-ventures",
} as const satisfies Record<string, string>;
