import eigenAIConference from "@/assets/photos/eigenai-conference.webp";
import adrienBeyk from "@/assets/photos/eigenai-2026/headshots/adrien-beyk.png";
import aryanYaghoubian from "@/assets/photos/eigenai-2026/headshots/aryan-yaghoubian.png";
import irisGuo from "@/assets/photos/eigenai-2026/headshots/iris-guo.png";
import naomiWalch from "@/assets/photos/eigenai-2026/headshots/naomi-walch.png";
import vincentXue from "@/assets/photos/eigenai-2026/headshots/vincent-xue.png";
import type {
  EigenAIPageContent,
  EigenAIScheduleDay,
  EigenAISpeaker,
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
    role: "Associate · Northside Ventures",
    profileImage: naomiWalch,
  },
  {
    name: "Vincent Xue",
    role: "Panelist · Northside Ventures",
    profileImage: vincentXue,
  },
  {
    name: "Iris Guo",
    role: "Panelist · Building Your Path in Tech",
    profileImage: irisGuo,
  },
  {
    name: "Aryan Yaghoubian",
    role: "Panelist · Building Your Path in Tech",
    profileImage: aryanYaghoubian,
  },
  {
    name: "Adrien Beyk",
    role: "Workshop host · Architecting Autonomy",
    profileImage: adrienBeyk,
    profileImagePosition: "50% 20%",
    profileImageScale: 2.25,
  },
];

const workshops: EigenAIWorkshop[] = [
  {
    title: "Research Workshop",
    host: "Ruihang Zhang",
    description: "Saturday, October 3 · 10:30–11:30 AM · OI 2212",
  },
  {
    title: "Publicus AI Workshop",
    host: "Publicus AI",
    description: "Saturday, October 3 · 10:30–11:30 AM · OI G162",
  },
  {
    title: "Architecting Autonomy",
    host: "Adrien Beyk",
    description: "Saturday, October 3 · 2:30–4:30 PM · OI 2212",
  },
  {
    title: "IEEE Workshop",
    host: "IEEE",
    description: "Saturday, October 3 · 2:30–4:30 PM · OI G162",
  },
  {
    title: "Applying Fintech Concepts and Industry Practices Using AI Agents",
    host: "Rotman Fintech Association",
    description: "Sunday, October 4 · 2:45–3:45 PM · OI 2212",
  },
  {
    title: "AI Agents Workshop",
    host: "UTMIST Academics",
    description: "Sunday, October 4 · 2:45–3:45 PM · OI 2214",
  },
];

const schedule: EigenAIScheduleDay[] = [
  {
    day: "Day 1",
    date: "Saturday October 3, 2026 · EDT",
    items: [
      { time: "8:30–9:00 AM", title: "Registration & Light Refreshments for Sponsors" },
      { time: "9:00–9:30 AM", title: "Student Registration" },
      {
        time: "9:30–10:15 AM",
        title: "Opening Ceremony, Sponsor Acknowledgement & Startup Intro",
        location: "OI G162",
      },
      { time: "10:15–10:30 AM", title: "Buffer Time" },
      {
        time: "10:30–11:30 AM",
        title: "Research Workshop",
        location: "OI 2212",
        description: "With Ruihang Zhang.",
      },
      {
        time: "10:30–11:30 AM",
        title: "Publicus AI Workshop",
        location: "OI G162",
      },
      {
        time: "11:30 AM–12:30 PM",
        title: "Engineering Project Showcase",
        location: "OI G162",
        description: "Presentations from new UTMIST internal projects.",
      },
      {
        time: "12:30–1:00 PM",
        title: "Lunch & Networking Session",
        location: "OI 2279",
        description:
          "Meet sponsors, ArcX2, GenAI Genesis, BiggerBird, and Neurotech.",
      },
      {
        time: "1:00–1:30 PM",
        title: "To Be Announced",
      },
      {
        time: "1:30–2:30 PM",
        title: "Building Your Path in Tech",
        location: "OI G162",
        description: "Panel with ArcX2.",
      },
      {
        time: "2:30–4:30 PM",
        title: "Architecting Autonomy",
        location: "OI 2212",
      },
      {
        time: "2:30–4:30 PM",
        title: "IEEE Workshop",
        location: "OI G162",
      },
      { time: "4:30–5:00 PM", title: "Closing Ceremony" },
    ],
  },
  {
    day: "Day 2",
    date: "Sunday October 4, 2026 · EDT",
    items: [
      {
        time: "8:30–9:00 AM",
        title: "Sponsor, Speaker, and Workshop Host Registration and Refreshments",
      },
      { time: "9:00–9:30 AM", title: "Student Registration" },
      { time: "9:30–10:00 AM", title: "Opening Ceremony" },
      {
        time: "10:00–11:00 AM",
        title: "Engineering Booth",
        location: "OI 2212",
      },
      {
        time: "10:00–11:00 AM",
        title: "Undergrad Research Panel",
        location: "OI G162",
        description:
          "Hear how undergraduate researchers found their positions, the skills they recommend, and their advice for getting started in AI research. Hosted by UTMIST Academics and Research.",
      },
      {
        time: "11:00 AM–12:00 PM",
        title: "Northside Ventures × Golden Ventures Panel",
        location: "OI G162",
        description: "With Naomi Walch and Vincent Xue.",
      },
      { time: "12:00–12:30 PM", title: "Lunch" },
      {
        time: "12:30–1:30 PM",
        title: "Sponsor, Startup, Research, and Academic Booths",
        location: "OI 2212",
      },
      {
        time: "1:30–2:30 PM",
        title: "Stripe Panel",
        location: "OI G162",
        description: "Panel with Faizan Naseer, Owen Christie, and Ryan Gosal.",
      },
      { time: "2:30–2:45 PM", title: "Snacks & Buffer Time" },
      {
        time: "2:45–3:45 PM",
        title: "Applying Fintech Concepts and Industry Practices Using AI Agents",
        location: "OI 2212",
        description: "Workshop with Rotman Fintech Association.",
      },
      {
        time: "2:45–3:45 PM",
        title: "aUtoronto Presentation",
        location: "OI G162",
        description: "Presentation and demo.",
      },
      {
        time: "2:45–3:45 PM",
        title: "AI Agents Workshop",
        location: "OI 2214",
        description: "Workshop with UTMIST Academics.",
      },
      { time: "3:45–4:15 PM", title: "Networking with Panel and Workshop Hosts" },
      { time: "4:15–5:00 PM", title: "Closing Ceremony" },
    ],
  },
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
