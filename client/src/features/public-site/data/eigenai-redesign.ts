import eigenAIConference from "@/assets/photos/eigenai-conference.webp";
import adrienBeyk from "@/assets/photos/eigenai-2026/headshots/adrien-beyk.png";
import aryanYaghoubian from "@/assets/photos/eigenai-2026/headshots/aryan-yaghoubian.png";
import irisGuo from "@/assets/photos/eigenai-2026/headshots/iris-guo.png";
import naomiWalch from "@/assets/photos/eigenai-2026/headshots/naomi-walch.png";
import vincentXue from "@/assets/photos/eigenai-2026/headshots/vincent-xue.png";
import ruihangZhang from "@/assets/photos/eigenai-2026/headshots/ruihang-zhang.png";
import arcX2Logo from "@/assets/photos/eigenai-2026/sponsors/arc-x2.png";
import cognitionAILogo from "@/assets/photos/eigenai-2026/sponsors/cognition-ai.png";
import fateLabsLogo from "@/assets/photos/eigenai-2026/sponsors/fate-labs.png";
import goldenVenturesLogo from "@/assets/photos/eigenai-2026/sponsors/golden-ventures.png";
import ieeeLogo from "@/assets/photos/eigenai-2026/sponsors/ieee.png";
import northsideVenturesLogo from "@/assets/photos/eigenai-2026/sponsors/northside-ventures.png";
import panoradAILogo from "@/assets/photos/eigenai-2026/sponsors/panorad-ai.png";
import publicusAILogo from "@/assets/photos/eigenai-2026/sponsors/publicus-ai.png";
import rcftaLogo from "@/assets/photos/eigenai-2026/sponsors/rcfta.png";
import stripeLogo from "@/assets/photos/eigenai-2026/sponsors/stripe.png";
import type {
  EigenAIPageContent,
  EigenAIScheduleDay,
  EigenAISpeaker,
  EigenAISponsor,
  EigenAIWorkshop,
} from "@/features/public-site/types/eigenai";

export const eigenAITicketUrl =
  "https://www.zeffy.com/en-CA/ticketing/eigenai--2026";

const comingSoonDescription = "Details coming soon.";

// Public event details from the master sheet and its linked CURRENT SCHEDULE.
// See docs/client/pages/EigenAI.md for sources and outstanding announcements.
// Organizer-supplied portraits, names, and titles supplement the planning schedule.
// The public lineup includes only guests with supplied headshots.
const speakers: EigenAISpeaker[] = [
  {
    name: "Naomi Walch",
    role: "Panelist · Northside Ventures",
    profileImage: naomiWalch,
  },
  {
    name: "Vincent Xue",
    role: "Panelist · Golden Ventures",
    profileImage: vincentXue,
  },
  {
    name: "Iris Guo",
    role: "Panelist · Planned",
    profileImage: irisGuo,
  },
  {
    name: "Aryan Yaghoubian",
    role: "Panelist · NVIDIA",
    profileImage: aryanYaghoubian,
  },
  {
    name: "Ruihang Zhang",
    role: "Workshop Host · UofT CS PhD",
    profileImage: ruihangZhang,
  },
  {
    name: "Adrien Beyk",
    role: "Workshop Host · Panorad AI",
    profileImage: adrienBeyk,
    profileImagePosition: "50% 20%",
    profileImageScale: 2.25,
  },
];

const workshops: EigenAIWorkshop[] = [
  {
    title: "Controllable Visual Generation Workshop",
    host: "Ruihang Zhang",
    description: "Saturday, October 3 · 10:30–11:30 AM",
  },
  {
    title: "AI For Government Workshop",
    host: "Publicus AI",
    description: "Saturday, October 3 · 10:30–11:30 AM",
  },
  {
    title: "AI Behind the Firewall Workshop",
    host: "Adrien Beyk · Panorad AI",
    description: "Saturday, October 3 · 2:30–4:30 PM",
  },
  {
    title: "IEEE Workshop",
    host: "IEEE University of Toronto",
    description: "Saturday, October 3 · 2:30–4:30 PM",
  },
  {
    title: "FinTech, Automated Workshop",
    host: "Rotman Commerce FinTech Association",
    description: "Sunday, October 4 · 2:45–3:45 PM",
  },
  {
    title: "Build an AI Agent Workshop",
    host: "UTMIST Academics",
    description: "Sunday, October 4 · 2:45–3:45 PM",
  },
];

const schedule: EigenAIScheduleDay[] = [
  {
    day: "Day 1",
    date: "Saturday October 3, 2026 · EDT",
    items: [
      { time: "9:15–9:50 AM", title: "Student Registration" },
      {
        time: "9:50–10:30 AM",
        title: "Opening Ceremony",
      },
      {
        time: "10:30–11:30 AM",
        title: "Controllable Visual Generation Workshop",
      },
      {
        time: "10:30–11:30 AM",
        title: "AI For Government — Publicus AI Workshop",
      },
      {
        time: "11:30 AM–12:30 PM",
        title: "Engineering Project Showcase",
      },
      {
        time: "12:30–1:30 PM",
        title: "Lunch & Networking Session",
      },
      {
        time: "1:30–2:30 PM",
        title: "Building Your Path in Tech — Arc X2 Panel",
      },
      {
        time: "2:30–4:30 PM",
        title: "AI Behind the Firewall — Panorad AI Workshop",
      },
      {
        time: "2:30–4:30 PM",
        title: "IEEE Workshop",
      },
      { time: "4:30–5:00 PM", title: "Closing Ceremony" },
    ],
  },
  {
    day: "Day 2",
    date: "Sunday October 4, 2026 · EDT",
    items: [
      { time: "9:00–9:30 AM", title: "Student Registration" },
      { time: "9:30–10:00 AM", title: "Opening Ceremony" },
      {
        time: "10:00–11:00 AM",
        title: "Engineering Booth",
      },
      {
        time: "10:00–11:00 AM",
        title: "Research Starts Here — UTMIST Academics & Research Panel",
      },
      {
        time: "11:00 AM–12:00 PM",
        title: "Funding the Frontier — Northside Ventures & Golden Ventures Panel",
      },
      { time: "12:00–12:30 PM", title: "Lunch" },
      {
        time: "12:30–1:30 PM",
        title: "Sponsor, UTMIST Startup, Research & Academic Booths",
      },
      {
        time: "1:30–2:45 PM",
        title: "Stripe Panel",
      },
      {
        time: "2:45–3:45 PM",
        title: "FinTech, Automated — RCFTA Workshop",
      },
      {
        time: "2:45–3:45 PM",
        title: "aUToronto Presentation",
      },
      {
        time: "2:45–3:45 PM",
        title: "Build an AI Agent — UTMIST Academics Workshop",
      },
      { time: "3:45–4:15 PM", title: "Networking Session" },
      { time: "4:15–5:00 PM", title: "Closing Ceremony" },
    ],
  },
];

const sponsors: EigenAISponsor[] = [
  { name: "Arc x2", logo: arcX2Logo, logoScale: 1.3 },
  { name: "Cognition AI", logo: cognitionAILogo, logoScale: 1.3 },
  { name: "Fate Labs", logo: fateLabsLogo },
  { name: "Golden Ventures", logo: goldenVenturesLogo },
  { name: "Northside Ventures", logo: northsideVenturesLogo },
  { name: "Panorad AI", logo: panoradAILogo },
  { name: "Publicus AI", logo: publicusAILogo, logoScale: 1.15 },
  { name: "Stripe", logo: stripeLogo },
  { name: "RCFTA", logo: rcftaLogo, logoScale: 0.85 },
  { name: "IEEE", logo: ieeeLogo },
];

export const eigenAIContent: EigenAIPageContent = {
  dateLabel: "October 3rd & 4th",
  locationLabel: "OISE",
  ticketUrl: eigenAITicketUrl,
  metrics: [],
  about: {
    image: eigenAIConference,
    imageAlt: "Panelists speaking with students at a past EigenAI conference",
    paragraphs: [
      "EigenAI is a UTMIST flagship conference introducing students to the world of AI, ML, software, and emerging technologies. Through panels and workshops covering both fundamental and advanced topics, participants gain hands-on experience and practical insights.",
      "This year’s theme is Across the Many Frontiers of AI, which invites students to journey through the many dimensions of AI, allowing them to explore the field from multiple perspectives and hear from professionals across diverse industries. Beyond technical talks and workshops, students have the opportunity to build their professional network and connect with industry leaders, academic professionals, and like-minded peers.",
    ],
  },
  keynote: null,
  speakers,
  workshops,
  schedule,
  scheduleNotice: "Schedule subject to change. All times are local to Toronto (EDT).",
  venue: {
    name: "Ontario Institute for Studies in Education (OISE)",
    address: "252 Bloor St W, Toronto, ON M5S 1V6, Canada",
    query: "OISE, 252 Bloor St W, Toronto, ON M5S 1V6, Canada",
  },
  sponsors,
  closingLines: ["Across the Many", "Frontiers of AI"],
};

/** Preview an event whose lineup, sessions, and location are not announced. */
export const eigenAIUnannouncedContent: EigenAIPageContent = {
  ...eigenAIContent,
  dateLabel: "Dates to be announced",
  locationLabel: undefined,
  ticketUrl: undefined,
  metrics: [],
  keynote: null,
  speakers: [],
  workshops: [],
  schedule: [],
  venue: null,
  sponsors: [],
};

/** Exercise wrapping, missing photos/links, optional hosts, and speaker bios. */
export const eigenAILongContent: EigenAIPageContent = {
  ...eigenAIContent,
  keynote: null,
  speakers: [
    {
      name: "Alexandria Montgomery-Wellington Researcher",
      role: "Principal Research Engineer and Community Educator at the Institute for Responsible Artificial Intelligence",
      bio: "Alexandria studies how people build, evaluate, and responsibly deploy machine learning systems. Her work brings together researchers, educators, and community partners to make emerging technology accessible to students across disciplines.",
    },
  ],
  workshops: [
    {
      title:
        "Building Accessible and Responsible Machine Learning Applications: From Research Prototypes to Community Projects",
      description: comingSoonDescription,
    },
  ],
};
