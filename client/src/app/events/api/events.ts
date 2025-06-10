// Type definitions
export interface Event {
  id: number;
  title: string;
  date: string;
  tags: string[];
}

export interface PastEvent extends Event {
  instructor: string;
  overview: string;
  learningGoals: string[];
  resources: { title: string; url: string; }[];
}

export interface UpcomingEvent extends Event {
  location: string;
  time: string;
  description: string;
  rsvpLink: string;
}

export interface FeaturedEvent {
  title: string;
  url: string;
  background: string;
  titleClassName?: string;
  titleAlignment?: 'left' | 'right';
  className?: string;
}

// Mock data
const mockUpcomingEvents: UpcomingEvent[] = [
  {
    id: 1,
    title: "SciML Workshop",
    location: "Bahen 1190",
    date: "May 12th, 2024",
    time: "17:00-19:00",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    rsvpLink: "https://www.eventbrite.ca/e/sci-ml-workshop-tickets-1141689918279",
    tags: ["Workshop", "Scientific ML", "Beginner-Friendly"]
  },
  {
    id: 2,
    title: "Paper Reading Workshop",
    location: "Bahen 1200",
    date: "May 12th, 2024",
    time: "17:00-19:00",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    rsvpLink: "https://www.eventbrite.ca/e/paper-reading-workshop-tickets-1141689918279",
    tags: ["Workshop", "Research", "LLMs"]
  }
];

const mockPastEvents: PastEvent[] = [
  {
    id: 3,
    title: "RL Workshop",
    instructor: "Andrew Magnuson",
    date: "May 5th, 2023",
    overview: "Curious about how AI agents learn to play games, control robots, or make decisions on their own? This beginner-friendly workshop is your gateway into the world of Reinforcement Learning (RL) – one of the most exciting fields in artificial intelligence.",
    learningGoals: [
      "Understand core concepts of Reinforcement Learning",
      "Learn about environments, rewards, and Q-learning",
      "Implement basic RL algorithms",
      "Gain hands-on experience with Python RL frameworks"
    ],
    resources: [
      {
        title: "Workshop Slides",
        url: "/resources/rl-workshop-slides.pdf"
      },
      {
        title: "GitHub Repository",
        url: "https://github.com/UTMIST/RL-Workshop"
      },
      {
        title: "OpenAI Gym Documentation",
        url: "https://gymnasium.farama.org/"
      }
    ],
    tags: ["Workshop", "Reinforcement Learning", "Python", "Beginner-Friendly"]
  },
  {
    id: 4,
    title: "Computer Vision Deep Dive",
    instructor: "Sarah Chen",
    date: "March 15th, 2024",
    overview: "An intensive workshop covering advanced computer vision techniques, from classical methods to modern deep learning approaches. Participants learned about CNN architectures, object detection, and image segmentation.",
    learningGoals: [
      "Master fundamental CV concepts and techniques",
      "Understand CNN architectures for vision tasks",
      "Implement object detection algorithms",
      "Practice with real-world CV applications"
    ],
    resources: [
      {
        title: "Workshop Materials",
        url: "/resources/cv-workshop-materials.zip"
      },
      {
        title: "PyTorch Vision Tutorial",
        url: "https://pytorch.org/tutorials/intermediate/torchvision_tutorial.html"
      }
    ],
    tags: ["Workshop", "Computer Vision", "Deep Learning", "PyTorch"]
  }
];

const mockFeaturedEvents: FeaturedEvent[] = [
  {
    title: "EigenAI",
    url: "/eigenai",
    background: 'linear-gradient(135deg, #e57fe5 0%, #8055e6 50%, #4099ee 100%)',
    titleClassName: 'title-large',
    titleAlignment: 'left',
    className: 'featured-card-large'
  },
  {
    title: "GenAI\nGenesis",
    url: "https://genaigenesis.ca",
    background: 'linear-gradient(135deg, #9966ff 0%, #4040e5 100%)',
    titleClassName: 'title-medium',
    titleAlignment: 'right'
  },
  {
    title: "AI^2",
    url: "/ai2",
    background: 'linear-gradient(135deg, #e57fe5 0%, #6655e6 100%)',
    titleClassName: 'title-large',
    titleAlignment: 'right',
    className: 'featured-card-large'
  },
  {
    title: "Project\nShowcase",
    url: "/showcase",
    background: 'linear-gradient(135deg, #372a5b 0%, #8673a1 50%, #e5a2d3 100%)',
    titleClassName: 'title-small',
    titleAlignment: 'left'
  }
];

// API functions
export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockUpcomingEvents);
    }, 500);
  });
}

export async function getPastEvents(): Promise<PastEvent[]> {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockPastEvents);
    }, 500);
  });
}

export async function getFeaturedEvents(): Promise<FeaturedEvent[]> {
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockFeaturedEvents);
    }, 500);
  });
}