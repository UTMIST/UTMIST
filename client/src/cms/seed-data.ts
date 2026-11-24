import careers from "../assets/careers.json" with { type: "json" };
import postsJson from "../assets/posts.json" with { type: "json" };
import projects from "../assets/projects.json" with { type: "json" };
import sponsorshipPackages from "../assets/sponsors.json" with { type: "json" };
import {
  pastEvents,
  upcomingEvents,
} from "../features/events/api/events.ts";
import { homeContent } from "../features/public-site/data/home-content.ts";
import { homeFaq } from "../features/public-site/data/home-faq.ts";
import { homeImpactContentData } from "../features/public-site/data/home-impact-content.ts";

export const PUBLIC_SEED_SOURCES = [
  "src/assets/careers.json",
  "src/assets/posts.json",
  "src/assets/projects.json",
  "src/assets/sponsors.json",
  "src/features/events/api/events.ts",
  "src/features/public-site/data/home-content.ts",
  "src/features/public-site/data/home-faq.ts",
  "src/features/public-site/data/home-impact.ts",
  "src/features/public-site/data/home-sponsors.ts",
  "src/features/public-site/data/eigenai-redesign.ts",
  "src/features/public-site/pages/startups.tsx",
] as const;

export const seedSourceData = {
  careers,
  events: [...upcomingEvents, ...pastEvents],
  homeContent,
  homeFaq,
  homeImpactContent: homeImpactContentData,
  posts: postsJson.posts,
  projects,
  sponsorshipPackages,
};

export const startupSeedData = [
  {
    name: "Caid",
    description: "AI-powered healthcare solutions",
    logoSource: "src/assets/photos/startups/caid-logo.png",
  },
  {
    name: "BuildSafe",
    description: "Construction safety technology",
    logoSource: "src/assets/photos/startups/buildsafe-logo.png",
  },
  {
    name: "ClearSite.ai",
    description: "AI-driven site analysis platform",
    logoSource: "src/assets/photos/startups/clearsite-logo.png",
  },
] as const;

export const partnerSeedData = [
  ["AMD", "https://www.amd.com/en", "src/assets/logos/amd.svg"],
  ["Modal", "https://modal.com/", "src/assets/logos/modal.png"],
  ["Qualcomm", "https://www.qualcomm.com/", "src/assets/logos/qualcomm.svg"],
  ["Vector Institute", "https://vectorinstitute.ai/", "src/assets/logos/vector.svg"],
  ["Google Cloud", "https://cloud.google.com/", "src/assets/logos/google-cloud.svg"],
  ["Cohere", "https://cohere.ai/", "src/assets/logos/cohere.webp"],
  ["Jarvis", "https://www.jrvs.ca/", "src/assets/logos/jarvis.webp"],
  ["Rotman School of Management", "https://www.rotman.utoronto.ca/", "src/assets/logos/rotman.webp"],
  ["Tenstorrent", "https://tenstorrent.com/", "src/assets/logos/tenstorrent.webp"],
  ["Aercoustics", "https://aercoustics.com/", "src/assets/logos/aerocoustics-transparent.png"],
  ["Wombo", "https://www.wombo.ai/", "src/assets/logos/wombo.svg"],
  ["Google", "https://www.google.com/", "src/assets/logos/google.webp"],
  ["PwC", "https://www.pwc.com/", "src/assets/logos/pwc-transparent.png"],
  ["RBC", "https://www.rbc.com/", "src/assets/logos/rbc.webp"],
  ["Edge AI", "https://www.edgeaiinnovations.com/", "src/assets/logos/EdgeAI.webp"],
  ["CGI", "https://www.cgi.com/", "src/assets/logos/cgi.webp"],
  [
    "CPSIF",
    "https://www.engineering.utoronto.ca/current-students/centralized-process-for-student-initiative-funding-cpsif/",
    "src/assets/logos/cpsif.svg",
  ],
  ["Engineering Society", "https://skule.ca/", "src/assets/logos/engsoc.svg"],
  ["Department of Computer Science", "https://web.cs.toronto.edu/", "src/assets/logos/compsci.webp"],
  ["Front Row Ventures", "https://frontrow.vc/", "src/assets/photos/ventures/frv-black-logo.png"],
  ["Forum Ventures", "https://www.forumvc.com/", "src/assets/photos/ventures/forum-black-purple-logo.png"],
] as const;

export const personSeedData = [
  "Naomi Walch",
  "Vincent Xue",
  "Iris Guo",
  "Aryan Yaghoubian",
  "Faizan Naseer",
  "Owen Christie",
  "Ryan Gosal",
  "Ruihang Zhang",
  "Adrien Beyk",
  "Vedant Harlaka",
  "Athavan Balakumar",
  "Ema Mylvaganam",
  "Aarav Kohil",
  "Doga Baskan",
  "Hasan Malik",
  "Yoyo Liu",
] as const;

export const pageSeedData = [
  {
    title: "Home",
    slug: "home",
    template: "home",
    introduction: {
      heading: homeContent.title,
      description: homeContent.about,
    },
    faq: homeFaq,
  },
  {
    title: "Departments",
    slug: "departments",
    template: "departments",
    introduction: {
      heading: "Departments",
      description: "Meet the students who lead and build UTMIST programs.",
    },
  },
  {
    title: "Sponsors",
    slug: "sponsors",
    template: "sponsors",
    introduction: {
      heading: "Let's Work Together",
      description:
        "Support UTMIST and gain access to student talent, networking opportunities, and nationwide visibility.",
    },
    sponsorshipPackages: sponsorshipPackages.map((item) => ({
      name: item.category,
      price: Number(item.price),
      benefits: item.perks.map((benefit) => ({ benefit })),
    })),
  },
  {
    title: "Projects",
    slug: "projects",
    template: "projects",
    introduction: {
      heading: "Projects",
      description: "Explore machine-learning projects built by UTMIST teams.",
    },
  },
  {
    title: "DeMISTify",
    slug: "blog",
    template: "blog",
    introduction: {
      heading: "DeMISTify",
      description: "UTMIST's technical content newsletter",
    },
  },
  {
    title: "MISTic R&D",
    slug: "startups",
    template: "startups",
    introduction: {
      heading: "MISTic R&D",
      description: homeContent.startups,
    },
  },
  {
    title: "Careers",
    slug: "careers",
    template: "careers",
    introduction: {
      heading: "Careers",
      description: "Help shape the future of AI and ML at UTMIST",
    },
  },
  {
    title: "Events",
    slug: "events",
    template: "events",
    introduction: {
      heading: "Events",
      description: "See what is happening in our UTMIST community",
    },
  },
  {
    title: "AI Squared",
    slug: "ai2",
    template: "ai2",
    introduction: {
      heading: "AI Squared",
      description:
        "A machine-learning tournament where students build AI agents and learn from mentors.",
    },
  },
  {
    title: "EigenAI",
    slug: "eigenai",
    template: "eigenai",
    introduction: {
      heading: "EigenAI",
      description:
        "UTMIST's flagship conference for AI, machine learning, software, and emerging technology.",
    },
  },
  {
    title: "Machine Learning Fundamentals",
    slug: "ml-fundamentals",
    template: "ml-fundamentals",
    introduction: {
      heading: "Machine Learning Fundamentals",
      description: "A beginner-friendly introduction to machine learning.",
    },
  },
] as const;
