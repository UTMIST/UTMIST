import dummy from "@/assets/photos/fibseq.webp";

export interface BlogPost {
  title: string;
  date: string;
  image: any;
  url: string;
}

export interface FeaturedBlogPost extends BlogPost {}

// 1. Featured Posts
const featuredPosts: FeaturedBlogPost[] = [
  {
    title: "DeMISTify: The AI Revolution",
    date: "Explore the latest trends and breakthroughs in AI and ML. Stay ahead of the curve with our curated content.",
    image: dummy,
    url: "https://www.utmist.com/demistify"
  },
  {
    title: "CPU Branch Prediction - Earliest Forms of ML",
    date: "Jan 26th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify"
  },
  {
    title: "DeMISTify: The AI Revolution",
    date: "Jan 26th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify"
  }
];

// 2. Recent Posts
const recentPosts: BlogPost[] = [
  {
    title: "Intro to Transformers",
    date: "Feb 3rd 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/transformers"
  },
  {
    title: "RAG: Retrieval-Augmented Generation",
    date: "Feb 10th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/rag"
  },
  {
    title: "Attention Is All You Need",
    date: "Feb 17th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/attention"
  },
  {
    title: "Diffusion Models Demystified",
    date: "Feb 24th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/diffusion"
  },
  {
    title: "How GPUs Actually Work",
    date: "Mar 1st 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/gpus"
  },
  {
    title: "Foundations of Reinforcement Learning",
    date: "Mar 8th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/rl"
  }
];

// 3. Archive Posts
const archivePosts: BlogPost[] = [
  {
    title: "Understanding Backpropagation",
    date: "Jan 15th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/backprop"
  },
  {
    title: "Neural Networks from Scratch",
    date: "Jan 8th 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/nn-scratch"
  },
  {
    title: "The Math Behind Machine Learning",
    date: "Jan 1st 2025",
    image: dummy,
    url: "https://www.utmist.com/demistify/ml-math"
  },
  {
    title: "Introduction to PyTorch",
    date: "Dec 25th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/pytorch"
  },
  {
    title: "Deep Learning Architectures",
    date: "Dec 18th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/architectures"
  },
  {
    title: "Natural Language Processing Basics",
    date: "Dec 11th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/nlp"
  },
  {
    title: "Computer Vision Fundamentals",
    date: "Dec 4th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/cv"
  },
  {
    title: "Machine Learning Optimization",
    date: "Nov 27th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/optimization"
  },
  {
    title: "Ethics in AI",
    date: "Nov 20th 2024",
    image: dummy,
    url: "https://www.utmist.com/demistify/ethics"
  }
];


// Dummy API calls

export async function getFeaturedPosts(): Promise<FeaturedBlogPost[]> {
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
