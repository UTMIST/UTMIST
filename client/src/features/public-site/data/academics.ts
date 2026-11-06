export const academicsArchivePath = "/ml-fundamentals/2025";

export type LearningResource = "slides" | "recording" | "code";

export interface AcademicSession {
  id: string;
  title: string;
  track: "Foundations" | "Frontiers";
  description: string;
  date: string;
  dateTime?: string;
  time: string;
  location: string;
  resources: Partial<Record<LearningResource, string>>;
}

// Design-preview content, not a published schedule. Replace this fixture with
// confirmed content through the same interface before approving a rollout.
const sampleSession = {
  description: "What is ML, types of ML, applications, linear regression basics, PyTorch introduction",
  date: "October 13, 2026",
  dateTime: "2026-10-13",
  time: "6:30 – 8:00 PM",
  location: "BA3200",
  resources: {},
} satisfies Omit<AcademicSession, "id" | "title" | "track">;

export const kickoffSession: AcademicSession = {
  ...sampleSession,
  id: "kickoff",
  title: "Kick-off",
  track: "Foundations",
};

export const academicTopics = [
  { id: "fundamentals", label: "Intro", title: "Fundamentals" },
  { id: "agents", label: "Topic 1", title: "Agents" },
  { id: "computer-vision", label: "Topic 2", title: "Computer Vision" },
  { id: "large-language-models", label: "Topic 3", title: "Large Language Models" },
  { id: "reinforcement-learning", label: "Topic 4", title: "Reinforcement Learning" },
].map((topic) => ({
  ...topic,
  sessions: (["Foundations", "Frontiers", "Foundations"] as const).map((track, index): AcademicSession => ({
    ...sampleSession,
    id: `${topic.id}-${index + 1}`,
    title: `Session ${index + 1}`,
    track,
  })),
}));

export const academicsFaqs = [
  {
    id: "prerequisites",
    question: "What prerequisites do I need for this workshop?",
    answer: "Basic knowledge of Python programming and high school mathematics (algebra, calculus) is recommended. No prior machine learning experience is required.",
  },
  {
    id: "tracks",
    question: "What is the difference between the two tracks?",
    answer: "Foundations focuses on core concepts, mathematics, and ML fundamentals. Frontiers explores advanced, hands-on implementations. Choose the track that fits your experience and interests.",
  },
  {
    id: "laptop",
    question: "Do I need to bring my own laptop?",
    answer: "Yes, please bring your own laptop for the hands-on workshops. We use Python and PyTorch to put the concepts into practice.",
  },
  {
    id: "materials",
    question: "Where can I find the workshop materials?",
    answer: "Each session card links to its slides, recording, and code when they are available. Unavailable resources are marked as coming soon.",
  },
  {
    id: "semester-two",
    question: "What happens in Semester 2?",
    answer: "Put your knowledge into practice through workshops on research opportunities, production-ready projects, industry ML careers, and more.",
  },
  {
    id: "past-years",
    question: "Can I access workshops from past years?",
    answer: "Yes. The 2025 MLF archive includes the original workshop content, slides, recordings, code, and project materials.",
    href: academicsArchivePath,
    linkLabel: "Browse the 2025 MLF archive",
  },
];

export const academicsPreviewTeam = [
  "Program Director", "Program Director",
  "Academics Team", "Academics Team", "Academics Team", "Academics Team",
  "Technical Writing Team", "Technical Writing Team",
].map((role, index) => ({ id: `preview-person-${index}`, name: "Bobby Lastname", role }));
