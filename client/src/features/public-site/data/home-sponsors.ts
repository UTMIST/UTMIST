import amdLogo from "@/assets/logos/amd.svg";
import qualcommLogo from "@/assets/logos/qualcomm.svg";
import vectorLogo from "@/assets/logos/vector.svg";
import googleCloudLogo from "@/assets/logos/google-cloud.svg";
import cohereLogo from "@/assets/logos/cohere.webp";
import jarvisLogo from "@/assets/logos/jarvis.webp";
import rotmanLogo from "@/assets/logos/rotman.webp";
import tenstorrentLogo from "@/assets/logos/tenstorrent.webp";
import aerocousticsLogo from "@/assets/logos/aerocoustics-transparent.png";
import womboLogo from "@/assets/logos/wombo.svg";
import googleLogo from "@/assets/logos/google.webp";
import pwcLogo from "@/assets/logos/pwc-transparent.png";
import rbcLogo from "@/assets/logos/rbc.webp";
import edgeAILogo from "@/assets/logos/EdgeAI.webp";
import cgiLogo from "@/assets/logos/cgi.webp";
import cpsifLogo from "@/assets/logos/cpsif.svg";
import engsocLogo from "@/assets/logos/engsoc.svg";
import compsciLogo from "@/assets/logos/compsci.webp";
import modalLogo from "@/assets/logos/modal.png";

import { homePageContent } from "@/features/public-site/data/home-page";

export const sponsorAssets = {
  amd: amdLogo, modal: modalLogo, qualcomm: qualcommLogo, vector: vectorLogo,
  "google-cloud": googleCloudLogo, cohere: cohereLogo, jarvis: jarvisLogo, rotman: rotmanLogo,
  tenstorrent: tenstorrentLogo, "aerocoustics-transparent": aerocousticsLogo, wombo: womboLogo,
  google: googleLogo, "pwc-transparent": pwcLogo, rbc: rbcLogo, edgeai: edgeAILogo,
  cgi: cgiLogo, cpsif: cpsifLogo, engsoc: engsocLogo, compsci: compsciLogo,
};

export const homeSponsors = homePageContent.sponsors.items.map(item => ({
  src: sponsorAssets[item.asset], alt: item.alt, link: item.href,
}));
