import type {
  EigenAIPageContent,
  EigenAIScheduleDay,
  EigenAIWorkshop,
} from "@/features/public-site/types/eigenai";

export const eigenAITicketUrl =
  "https://www.zeffy.com/en-CA/ticketing/eigenai--2026?utm_source=ig&utm_medium=social&utm_content=link_in_bio";

const comingSoonDescription = "Details coming soon.";

const workshops: EigenAIWorkshop[] = [
  { title: "IEEE Workshop", description: comingSoonDescription },
  {
    title: "Adrien Beyk / Panorad AI workshop",
    description: comingSoonDescription,
  },
  { title: "RCFTA Workshop", description: comingSoonDescription },
  {
    title: "Workshop (name coming soon)",
    description: comingSoonDescription,
  },
];

const schedule: EigenAIScheduleDay[] = [
  {
    day: "Day 1",
    date: "Saturday October 3, 2026 · EST",
    items: [
      { time: "8:30–9:00", title: "Sponsor registration and refreshments" },
      { time: "9:00–9:30", title: "Student registration" },
      {
        time: "9:30–10:15",
        title: "Opening Ceremony, sponsor presentations, and startup intro",
        location: "OI G162",
      },
      { time: "10:15–10:30", title: "Buffer" },
      { time: "10:30–11:30", title: "IEEE Workshop", location: "OI 2212" },
      { time: "10:30–11:30", title: "Publicus AI", location: "OI G162" },
      {
        time: "10:30–11:30",
        title: "BiggerBird and Neurotech booths",
        location: "OI 2279",
      },
      { time: "11:30–11:45", title: "Snacks and Buffer" },
      {
        time: "11:45–12:30",
        title: "Engineering Project Showcase",
        location: "OI G162",
        description: "Time subject to confirmation.",
      },
      { time: "12:30–1:00", title: "Lunch and sponsor networking booths" },
      {
        time: "1:00–1:30",
        title: "Coming soon",
        description: "Details to be confirmed.",
      },
      { time: "1:30–2:30", title: "Sina Panel", location: "OI G162" },
      {
        time: "2:30–4:00",
        title: "Adrien Beyk / Panorad AI workshop",
        location: "OI 2212",
      },
      {
        time: "2:30–4:00",
        title: "Workshop",
        location: "OI 2279",
        description: "Name to be announced.",
      },
      { time: "4:00–5:00", title: "Closing Ceremony" },
    ],
  },
  {
    day: "Day 2",
    date: "Sunday October 4, 2026 · EST",
    items: [
      {
        time: "8:30–9:00",
        title: "Sponsor, speaker, and workshop host registration",
      },
      { time: "9:00–9:30", title: "Student registration" },
      { time: "9:30–10:00", title: "Opening Ceremony" },
      {
        time: "10:00–11:00",
        title: "Engineering Booth (13–14)",
      },
      {
        time: "10:00–11:00",
        title: "Undergrad Research Panel / UTMIST Academics and Research",
        location: "OI G162",
      },
      {
        time: "11:00–12:00",
        title: "Northside Venture panel",
        location: "OI G162",
      },
      { time: "12:00–12:30", title: "Lunch" },
      {
        time: "12:30–1:30",
        title: "Sponsor, company, startup, research, and academic booths",
        location: "OI 2212",
      },
      { time: "1:45–2:45", title: "Stripe Panel", location: "OI G162" },
      { time: "2:45–3:00", title: "Snacks and buffer" },
      { time: "3:00–4:00", title: "RCFTA Workshop", location: "OI 2212" },
      {
        time: "3:00–4:00",
        title: "aUtoronto Presentation",
        location: "OI G162",
      },
      {
        time: "3:00–4:00",
        title: "Workshop",
        location: "OI 2214",
        description: "Name to be announced.",
      },
      { time: "4:00–4:15", title: "Networking" },
      { time: "4:15–5:00", title: "Closing Ceremony" },
    ],
  },
];

export const eigenAIContent: EigenAIPageContent = {
  dateLabel: "Saturday October 3, 2026 and Sunday October 4, 2026 · EST",
  locationLabel: "OISE",
  ticketUrl: eigenAITicketUrl,
  metrics: [],
  about: {
    paragraphs: [
      "EigenAI is a UTMIST flagship conference introducing students to the world of AI, ML, software, and emerging technologies. Through panels and workshops covering both fundamental and advanced topics, participants gain hands-on experience and practical insights.",
      "This year’s theme is Mapping AI through the Multiverse, which invites students to journey through the many dimensions of AI, allowing them to explore the field from multiple perspectives and hear from professionals across diverse industries. Beyond technical talks and workshops, students have the opportunity to build their professional network and connect with industry leaders, academic professionals, and like-minded peers.",
    ],
  },
  keynote: null,
  speakers: [],
  workshops,
  schedule,
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
