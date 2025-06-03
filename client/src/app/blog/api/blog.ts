import dummy from "@/assets/photos/fibseq.webp";
import { StaticImageData } from "next/image";

export interface BlogPost {
  title: string;
  date: string;
  author: string;
  image?: StaticImageData | string;
  url: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "Notochord: Is musical improvisation the final frontier of AI pretending to have a soul?",
    author: "Gabriel Thompson",
    date: "Apr 28, 2024",
    url: "https://medium.com/demistify/notochord-is-musical-improvisation-the-final-frontier-of-ai-pretending-to-have-a-soul-54dadb1ea121"
  },
  {
    title: "XIL-ADR: A New Approach to Iteratively Improving AI Models",
    author: "Emma Gillott",
    date: "Apr 28, 2024",
    url: "https://medium.com/demistify/xil-adr-a-new-approach-to-iteratively-improving-ai-models-bda0e4540738"
  },
  {
    title: "Boosting AI Accelerator Performance with Quantization",
    author: "Jeremy Qu",
    date: "Apr 28, 2024",
    url: "https://medium.com/demistify/boosting-ai-accelerator-performance-with-quantization-b1212160d86a"
  },
  {
    title: "Memory optimization: Cure Out Of Memory errors like a doctor",
    author: "Ambrose Ling",
    date: "Apr 28, 2024",
    url: "https://medium.com/demistify/memory-optimization-cure-out-of-memory-errors-like-a-doctor-fe3d9b8a6b5e"
  },
  {
    title: "Do LLMs really have emergent Cognitive Abilities?",
    author: "Mishaal Kandapath",
    date: "Mar 20, 2024",
    url: "https://medium.com/demistify/do-llms-really-have-emergent-cognitive-abilities-95f613898ad6"
  },
  {
    title: "The Human Factor: AI Learning from Preferences",
    author: "Akshat Naik",
    date: "Mar 5, 2024",
    url: "https://medium.com/demistify/the-human-factor-ai-learning-from-preferences-7d2eba637b4f"
  },
  {
    title: "Which Algorithm Do I Use For My New Application !?",
    author: "Muhammad Ali Hafeez",
    date: "Jan 19, 2024",
    url: "https://medium.com/demistify/which-algorithm-do-i-use-for-my-new-application-f36a986cb4c9"
  },
  {
    title: "Adversarial Diffusion Distillation: the return of GANs in generative modelling???",
    author: "Ambrose Ling",
    date: "Jan 16, 2024",
    url: "https://medium.com/demistify/adversarial-diffusion-distillation-the-return-of-gans-in-generative-modelling-bc56b59b765f"
  },
  {
    title: "Beyond Algorithms — The Role of Hardware Parallelism in Accelerating Neural Networks",
    author: "Jeremy Qu",
    date: "Jan 16, 2024",
    url: "https://medium.com/demistify/beyond-algorithms-the-role-of-hardware-parallelism-in-accelerating-neural-networks-0d790d747685"
  },
  {
    title: "Multi-Agent Trajectory Prediction: Bringing deep learning to the beautiful game.",
    author: "Ambrose Ling",
    date: "Jan 16, 2024",
    url: "https://medium.com/demistify/multi-agent-trajectory-prediction-bringing-deep-learning-to-the-beautiful-game-6a60191faf6c"
  },
  {
    title: "Concrete Problems in AI Safety",
    author: "Ambrose Ling",
    date: "Jan 16, 2024",
    url: "https://medium.com/demistify/concrete-problems-in-ai-safety-235c245f50ae"
  },
  {
    title: "Machine Learning for Education — Educational Data Mining",
    author: "Ambrose Ling",
    date: "Jan 16, 2024",
    url: "https://medium.com/demistify/machine-learning-for-education-educational-data-mining-2aaee6f32a3a"
  },
  {
    title: "How this AI can Characterize Smell",
    author: "Muhammad Ali Hafeez",
    date: "Jan 16, 2024",
    url: "https://medium.com/demistify/how-this-ai-can-characterize-smell-bd008f3916a5"
  },
  {
    title: "Director: Hierarchical Learning by Planning Inside Latent Spaces",
    author: "Mishaal Kandapath",
    date: "Oct 18, 2023",
    url: "https://medium.com/demistify/director-hierarchical-learning-by-planning-inside-latent-spaces-9bfd76b8d64e"
  },
  {
    title: "Whisper",
    author: "Zoey Zhang",
    date: "June 26, 2023",
    url: "https://medium.com/demistify/whisper-fb6219f36b52"
  },
  {
    title: "Is AI Coming for the Music Industry?",
    author: "Shirley Wang",
    date: "March 6, 2023",
    url: "https://medium.com/demistify/is-ai-is-coming-for-the-music-industry-885c11efbac2"
  },
  {
    title: "BioGPT for Biomedical Text Generation and Mining",
    author: "Jennifer Zhang",
    date: "February 28, 2023",
    url: "https://medium.com/demistify/biogpt-for-biomedical-text-generation-and-mining-678576f4fee0"
  },
];

// 1. Featured Posts
const featuredPosts: BlogPost[] = blogPosts.slice(0, 3);

// 2. Recent Posts
const recentPosts: BlogPost[] = blogPosts.slice(3, 9);

// 3. Archive Posts - all posts
const archivePosts: BlogPost[] = blogPosts.slice(9,);


// Dummy API calls

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(featuredPosts), 500);
  });
}

export async function getRecentPosts(): Promise<BlogPost[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(recentPosts), 500);
  });
}

export async function getArchivePosts(): Promise<BlogPost[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(archivePosts), 500);
  });
}
