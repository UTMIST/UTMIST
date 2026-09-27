import type {
  EigenAIPageContent,
  EigenAIScheduleDay,
  EigenAIWorkshop,
} from "@/features/public-site/types/eigenai";
import {
  founderPanelSpeakers,
  keynoteSpeakers,
  researchPanelSpeakers,
  speakerSession,
} from "@/features/public-site/data/eigenai";

// Review fixtures only: these names and sessions are not a confirmed lineup.
const currentSpeakers = [
  ...speakerSession,
  ...founderPanelSpeakers,
  ...researchPanelSpeakers,
];

const placeholderSpeakerCopy = [
  {
    name: "Someguy Lastnameem",
    role: "Staff Software Engineer and Manager @ Google",
  },
  {
    name: "Some Guy",
    role: "Data Scientist @ Super Long Company Name",
  },
  {
    name: "Guy With Threenames",
    role: "CEO @ Short",
  },
] as const;

const speakers = currentSpeakers.slice(0, 8).map((speaker, index) => ({
  ...placeholderSpeakerCopy[index % placeholderSpeakerCopy.length],
  profileURL: "",
  profileImage: speaker.profileImage,
}));

const keynoteSpeaker = {
  ...keynoteSpeakers[0],
  name: "Jensen Huang",
  role: "CEO @ NVIDIA",
};

const workshopDescription =
  "An introduction on how to integrate the Claude API into any application, using a chat app as a demonstration. The goal is to introduce fundamental API integration skills including API key access, HTTP request authentication, and JSON response handling. The workshop also covers Claude-specific parameters such as temperature settings, system prompts and multi-turn conversation management.";

const workshops: EigenAIWorkshop[] = Array.from({ length: 3 }, () => ({
  title: "Building Applications with the Claude API",
  host: "",
  description: workshopDescription,
}));

const description = "Session details will be announced soon.";
const location = "Room TBA";
const schedule: EigenAIScheduleDay[] = [
  {
    day: "Day 1",
    date: "Saturday, October 3",
    items: [
      { time: "9:00 AM", title: "Opening Session", description, location },
      { time: "10:00 AM", title: "Session Title", location },
      { time: "11:00 AM", title: "Session Title", description, location },
      { time: "12:00 PM", title: "Lunch Break", location },
      { time: "1:00 PM", title: "Session Title", location },
      { time: "2:00 PM", title: "Session Title", description, location },
      { time: "3:00 PM", title: "Session Title", location },
      { time: "4:00 PM", title: "Closing Session", location },
    ],
  },
  {
    day: "Day 2",
    date: "Sunday, October 4",
    items: [
      { time: "9:00 AM", title: "Welcome Back", description, location },
      { time: "10:00 AM", title: "Session Title", location },
      { time: "11:00 AM", title: "Session Title", description, location },
      { time: "12:00 PM", title: "Lunch Break", location },
      { time: "1:00 PM", title: "Session Title", location },
      { time: "2:00 PM", title: "Session Title", description, location },
      { time: "3:00 PM", title: "Session Title", location },
      { time: "4:00 PM", title: "Closing Session", location },
    ],
  },
];

export const eigenAIContent: EigenAIPageContent = {
  dateLabel: "October 3rd & 4th",
  locationLabel: "LOCAT",
  metrics: [
    { number: "500+", description: "Attendees" },
    { number: "20", description: "Speakers" },
    { number: "11", description: "Workshops" },
  ],
  about: {
    paragraphs: [
      "EigenAI is a UTMIST flagship conference introducing students to the world of AI, ML, software, and emerging technologies. Through panels and workshops covering both fundamental and advanced topics, participants gain hands-on experience and practical insights.",
      "This year’s theme is Mapping AI through the Multiverse, which invites students to journey through the many dimensions of AI, allowing them to explore the field from multiple perspectives and hear from professionals across diverse industries. Beyond technical talks and workshops, students have the opportunity to build their professional network and connect with industry leaders, academic professionals, and like-minded peers.",
    ],
  },
  keynote: keynoteSpeaker,
  speakers,
  workshops,
  schedule,
  venue: {
    name: "Ontario Institute for Studies in Education (OISE)",
    address: "252 Bloor St W, Toronto, ON",
    query: "OISE, 252 Bloor St W, Toronto, ON",
  },
  closingLines: ["Across the Many", "Frontiers of AI"],
};

/** Preview an event whose lineup, sessions, and location are not announced. */
export const eigenAIUnannouncedContent: EigenAIPageContent = {
  ...eigenAIContent,
  dateLabel: "Dates to be announced",
  locationLabel: undefined,
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
      description: workshopDescription,
    },
  ],
};
